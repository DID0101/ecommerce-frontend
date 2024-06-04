import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Address } from "@/models/Address";

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { user } = session;

    if (req.method === 'PUT') {
      try {
        const address = await Address.findOne({ userEmail: user.email });
        if (address) {
          const updatedAddress = await Address.findByIdAndUpdate(address._id, req.body, { new: true });
          return res.json(updatedAddress);
        } else {
          const newAddress = await Address.create({ userEmail: user.email, ...req.body });
          return res.json(newAddress);
        }
      } catch (error) {
        return res.status(500).json({ error: "Failed to update or create address" });
      }
    }

    if (req.method === 'GET') {
      try {
        const address = await Address.findOne({ userEmail: user.email });
        if (!address) {
          return res.status(404).json({ error: "Address not found" });
        }
        return res.json(address);
      } catch (error) {
        return res.status(500).json({ error: "Failed to fetch address" });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
