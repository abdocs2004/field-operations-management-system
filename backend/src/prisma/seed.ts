import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateReceiptNumber } from "../utils/receiptNumber";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo@12345";

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "مدير النظام",
      email: "admin@example.com",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@example.com" },
    update: {},
    create: {
      name: "المشرف العام",
      email: "supervisor@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const fieldUser = await prisma.user.upsert({
    where: { email: "field@example.com" },
    update: {},
    create: {
      name: "موظف الميدان",
      email: "field@example.com",
      passwordHash,
      role: "FIELD_USER",
    },
  });

  const serviceNames = ["النقل", "التوريد", "الشحن", "التخزين", "الصيانة"];
  const services = [];
  for (const name of serviceNames) {
    const service = await prisma.service.upsert({
      where: { name },
      update: {},
      create: { name, description: `خدمة ${name}` },
    });
    services.push(service);
  }

  await prisma.announcement.createMany({
    data: [
      {
        title: "تحديث النظام",
        content: "تم تسجيل العمليات اليومية بنجاح، شكرًا لتعاونكم.",
        isActive: true,
      },
      {
        title: "تنبيه صيانة",
        content: "سيتم إجراء صيانة دورية للنظام يوم الجمعة القادم من الساعة 2 إلى 4 صباحًا.",
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  const existingOps = await prisma.operation.count();
  if (existingOps === 0) {
    const customers = ["أحمد محمد", "شركة الفا للتجارة", "مؤسسة النور", "سعيد العتيبي", "شركة بيتا اللوجستية"];
    const beneficiaries = ["شركة الوفاء", "مؤسسة الأمانة", "شركة الرياض للنقل", "عبدالله القحطاني"];
    const statuses = ["COMPLETED", "COMPLETED", "COMPLETED", "PENDING", "CANCELLED"] as const;

    for (let i = 0; i < 40; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const receiptNumber = await generateReceiptNumber(prisma);
      const service = services[Math.floor(Math.random() * services.length)];
      const createdBy = Math.random() > 0.3 ? fieldUser : supervisor;

      await prisma.operation.create({
        data: {
          receiptNumber,
          customerName: customers[Math.floor(Math.random() * customers.length)],
          serviceId: service.id,
          quantity: Math.round((Math.random() * 1000 + 10) * 100) / 100,
          unit: "كجم",
          amount: Math.round((Math.random() * 9000 + 100) * 100) / 100,
          beneficiaryName: beneficiaries[Math.floor(Math.random() * beneficiaries.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdById: createdBy.id,
          createdAt,
          updatedAt: createdAt,
        },
      });
    }
  }

  console.log("✅ Seed complete.");
  console.log("──────────────────────────────────────────");
  console.log("Demo accounts (password for all): ", DEMO_PASSWORD);
  console.log("  SUPER_ADMIN : admin@example.com");
  console.log("  ADMIN       : supervisor@example.com");
  console.log("  FIELD_USER  : field@example.com");
  console.log("──────────────────────────────────────────");
  console.log(`Users: ${superAdmin.email}, ${supervisor.email}, ${fieldUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
