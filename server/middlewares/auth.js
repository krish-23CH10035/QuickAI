import { clerkClient } from '@clerk/express';

// Middleware to check userId and plan (lazily checks Clerk config at request time)
export const auth = async (req, res, next) => {
    // Lazy check: dotenv.config() has already run by now
    const clerkConfigured = Boolean(
        process.env.CLERK_SECRET_KEY ||
        process.env.CLERK_API_KEY ||
        process.env.CLERK_FRONTEND_API
    );
    if (!clerkConfigured) {
        return res.status(503).json({ success: false, message: 'Server misconfigured: Clerk is not set.' });
    }
    try {
        const { userId, has } = await req.auth();
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const hasPremiumPlan = await has({ plan: 'premium' });
        const user = await clerkClient.users.getUser(userId);

        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: 0 }
            });
            req.free_usage = 0;
        }
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}