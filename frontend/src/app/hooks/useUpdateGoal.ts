import { useState } from "react";

interface UpdateGoalData {
    name?: string;
    current?: number;
    target?: number;
    deadline?: string;
}

interface UseUpdateGoalReturn {
    updateGoal: (id: number, data: UpdateGoalData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

export function useUpdateGoal(): UseUpdateGoalReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const updateGoal = async (id: number, data: UpdateGoalData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),

            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to update goal.");
            }
        } catch (err) {
            console.error("Error updating goal:", err);
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return { updateGoal, isLoading, error, success };
}