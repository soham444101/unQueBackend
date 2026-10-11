
async function getLeadData(leadgenId) {

  let frontendData = null;
  try {
    console.log("getLeadData leadgenId", leadgenId);


    const res = await fetch(`https://graph.facebook.com/v26.0/${leadgenId}?fields=id%2Ccreated_time%2Cfield_data%2Cform_id&access_token=${String(process.env.META_PAGE_ACCESS_TOKEN)}`)


    const data = await res.json();
    if (Object.keys(data).length > 0 && data.hasOwnProperty('error')) {
      console.error("Error occuring in time of fetchinglead throught graph api", data.error)
      return;
    }
    console.log("getLeadData data", data);
    const isFDArray = Array.isArray(data?.field_data);
    if (!isFDArray) {
      console.error("Somthing wrong field data coming in graph apiof lead is not array", data?.field_data);
      return;
    }
    frontendData = {
      email: data.field_data.find(field => field.name === 'email')?.values[0] || '',
      full_name: data.field_data.find(field => field.name === 'full_name')?.values[0] || '',
      phone_number: data.field_data.find(field => field.name === 'phone_number')?.values[0] || '',
    }
  } catch (error) {
    console.error("Fetch function Error occuring in time of fetchinglead throught graph api", error)
  } finally {
    return frontendData;
  }


//   ```
//     id": "1118962753891509",
//   "created_time": "2026-10-09T11:26:25+0000",
//   "field_data": [
//     {
//       "name": "you_are_a_software_developer?",
//       "values": [
//         "<test lead: dummy data for you_are_a_software_developer?>"
//       ]
//     },
//     {
//       "name": "describe_you_software_experience_?",
//       "values": [
//         "<test lead: dummy data for describe_you_software_experience_?>"
//       ]
//     },
//     {
//       "name": "email",
//       "values": [
//         "test@meta.com"
//       ]
//     },
//     {
//       "name": "full_name",
//       "values": [
//         "<test lead: dummy data for full_name>"
//       ]
//     },
//     {
//       "name": "phone_number",
//       "values": [
//         "<test lead: dummy data for phone_number>"
//       ]
//     },
//     {
//       "name": "inbox_url",
//       "values": [
//         "<test lead: dummy data for inbox_url>"
//       ]
//     }
//   ],
//   "form_id": "1439403894782786"
// }
//   ```
}

export { getLeadData };