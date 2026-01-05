/**
 *  An example function to echo the body of a POST request.
 *  This route is accessible at /server-function/echo
 */
export default async function echo(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const data = await req.json();

  // Process the data and return a response
  return new Response(JSON.stringify(data), { status: 200 });
}

/* 
  If you want to charge credits for using this server function,
  uncomment the line below and set the desired credit cost.
  Each unique API endpoint's cost cannot be changed after deployment.
  To update costs, you must deploy a new endpoint. 
*/
// export const _CREDIT_PER_CALL = 1;