import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, name }: ContactRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const HUBSPOT_ACCESS_TOKEN = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
    if (!HUBSPOT_ACCESS_TOKEN) {
      console.error("HUBSPOT_ACCESS_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "HubSpot integration not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse name if provided but firstName/lastName aren't
    let first = firstName;
    let last = lastName;
    if (!first && !last && name) {
      const parts = name.trim().split(/\s+/);
      first = parts[0];
      last = parts.slice(1).join(' ');
    }

    console.log(`[HubSpot] Syncing contact: ${email}`, { firstName: first, lastName: last });

    // Step 1: Ensure "Creators" list exists
    let listId: number | null = null;

    try {
      // Try to find the "Creators" list
      const listSearchResponse = await fetch("https://api.hubapi.com/contacts/v1/lists", {
        headers: { "Authorization": `Bearer ${HUBSPOT_ACCESS_TOKEN}` }
      });

      if (listSearchResponse.ok) {
        const lists = await listSearchResponse.json();
        const creatorsList = lists.lists?.find((l: any) => l.name === "Creators");

        if (creatorsList) {
          listId = creatorsList.listId;
          console.log(`[HubSpot] Found existing "Creators" list: ${listId}`);
        } else {
          // Create the "Creators" list
          const createListResponse = await fetch("https://api.hubapi.com/contacts/v1/lists", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: "Creators",
              dynamic: false
            })
          });

          if (createListResponse.ok) {
            const newList = await createListResponse.json();
            listId = newList.listId;
            console.log(`[HubSpot] Created "Creators" list: ${listId}`);
          } else {
            console.error(`[HubSpot] Failed to create list:`, await createListResponse.text());
          }
        }
      }
    } catch (error) {
      console.error(`[HubSpot] Error managing list:`, error);
    }

    // Step 2: Create or update contact
    const hubspotResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email,
          ...(first && { firstname: first }),
          ...(last && { lastname: last }),
        },
      }),
    });

    const responseText = await hubspotResponse.text();
    let contactId: string | null = null;

    if (!hubspotResponse.ok) {
      // Check if contact already exists (409 conflict)
      if (hubspotResponse.status === 409) {
        console.log(`[HubSpot] Contact already exists: ${email}`);

        // Search for existing contact to get ID
        try {
          const searchResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/search`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              filterGroups: [{
                filters: [{ propertyName: "email", operator: "EQ", value: email }]
              }]
            })
          });

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.results && searchData.results.length > 0) {
              contactId = searchData.results[0].id;
              console.log(`[HubSpot] Found existing contact ID: ${contactId}`);
            }
          }
        } catch (error) {
          console.error(`[HubSpot] Error searching for contact:`, error);
        }
      } else {
        console.error(`[HubSpot] API error (${hubspotResponse.status}):`, responseText);
        return new Response(
          JSON.stringify({ error: `HubSpot API error: ${responseText}` }),
          { status: hubspotResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      const data = JSON.parse(responseText);
      contactId = data.id;
      console.log(`[HubSpot] Contact created successfully:`, contactId);
    }

    // Step 3: Add contact to "Creators" list if we have both IDs
    if (contactId && listId) {
      try {
        const addToListResponse = await fetch(`https://api.hubapi.com/contacts/v1/lists/${listId}/add`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            vids: [parseInt(contactId)]
          })
        });

        if (addToListResponse.ok) {
          console.log(`[HubSpot] Contact ${contactId} added to Creators list ${listId}`);
        } else {
          console.error(`[HubSpot] Failed to add contact to list:`, await addToListResponse.text());
        }
      } catch (error) {
        console.error(`[HubSpot] Error adding contact to list:`, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, contactId, listId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[HubSpot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
