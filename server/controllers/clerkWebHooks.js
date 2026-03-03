import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // ✅ Convertir le Buffer en string pour la vérification
    const payload = req.body.toString()
    await whook.verify(payload, headers);

    // ✅ Parser le JSON après la vérification
    const { data, type } = JSON.parse(payload);

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0]?.email_address || "",
          image: data.image_url,
          role: "student",
        };
        await User.create(userData);
        res.json({ success: true, message: "User created" });
        break;
      }

      case "user.updated": {
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            name: `${data.first_name} ${data.last_name}`,
            email: data.email_addresses[0]?.email_address || "",
            image: data.image_url,
          },
          { new: true }
        );
        res.json({ success: true, message: "User updated" });
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: data.id });
        res.json({ success: true, message: "User deleted" });
        break;
      }

      default:
        res.json({ success: true, message: "Event not handled" });
        break;
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;