import { useState } from "react";

export const useCreateGoal = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createGoal = async (goal: { [key: string]: any }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(goal),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to create goal");
            }

            const data = await response.json(); // Parse the response
            return data; // Return the created goal
        } catch (err: any) {
            setError(err.message);
            throw err; // Re-throw the error to handle it in the calling function
        } finally {
            setLoading(false);
        }
    };

    return { createGoal, loading, error };
};