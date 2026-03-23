import prisma from "../lib/prisma.js";
import bcrypt, { genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";

const signUp = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return next({ status: 400, message: "All fields are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!isValidEmail(normalizedEmail)) {
            return next({ status: 400, message: "Invalid email format" });
        }

        if (!isValidPassword(password)) {
            return next({
                status: 400,
                message: "Password must be strong"
            });
        }

        const salt = await genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name,
                password: hashedPassword
            }
        });

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
        });

        res.status(201).json({
            success: true,
            user: {
                userId: user.id,
                userName: user.name,
                userEmail: user.email
            }
        });

    } catch (error) {
        if (error.code === "P2002") {
            return next({ status: 409, message: "Email already registered" });
        }

        return next(error);
    }
};

export { signUp };