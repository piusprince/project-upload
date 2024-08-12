import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      console.log({ result });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.students.createStudent, {
            tokenIdentifier: `https://quiet-whippet-31.clerk.accounts.dev|${result.data.id}`,
            name: `${result.data.first_name ?? ""} ${result.data.last_name ?? ""}`,
            // email: result.data.email_addresses[0]?.email_address,
            image: result.data.image_url,
            // department: "", // To be filled later
            // graduationYear: null, // To be filled later
          });
          break;

        case "user.updated":
          await ctx.runMutation(internal.students.updateStudent, {
            tokenIdentifier: `https://quiet-whippet-31.clerk.accounts.dev|${result.data.id}`,
            name: `${result.data.first_name ?? ""} ${result.data.last_name ?? ""}`,
            email: result.data.email_addresses[0]?.email_address,
            image: result.data.image_url,
          });
          break;

        case "organizationMembership.created":
          await ctx.runMutation(internal.students.addOrgIdToStudent, {
            tokenIdentifier: `https://quiet-whippet-31.clerk.accounts.dev|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: determineStudentRole(result.data.role),
          });
          break;

        case "organizationMembership.updated":
          await ctx.runMutation(internal.students.updateRoleInOrgForStudent, {
            tokenIdentifier: `https://quiet-whippet-31.clerk.accounts.dev|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: determineStudentRole(result.data.role),
          });
          break;
      }

      return new Response(null, { status: 200 });
    } catch (err) {
      console.error("Webhook Error:", err);
      return new Response("Webhook Error", { status: 400 });
    }
  }),
});

function determineStudentRole(clerkRole: string): "admin" | "student" {
  return clerkRole === "org:admin" ? "admin" : "student";
}

export default http;
