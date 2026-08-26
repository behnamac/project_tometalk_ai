// Promote an existing user to the "admin" role by email.
// Usage: npm run set-admin -- you@example.com
import prisma from "../database/prisma";

async function main() {
    const email = process.argv[2]?.trim();

    if (!email) {
        console.error("Usage: npm run set-admin -- <email>");
        process.exit(1);
    }

    const user = await prisma.user.update({
        where: { email },
        data: { role: "admin" },
    });

    console.log(`OK: ${user.email} (${user.id}) role is now "${user.role}"`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
