import { useState } from "react";

export const useCreateBudget = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const createBudget = async (budgetDTO: BudgetDTO) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(budgetDTO),
            });

            if (!response.ok) {
                throw new Error("Failed to create budget");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { createBudget, loading, error, success };
};

export interface BudgetDTO {
    id: number;
    name: string;
    totalAmount: number;
    categories: BudgetCategoryDTO[];
    shared: boolean;
    members: MemberDTO[];
    startDate: string;
    endDate: string;
}

export interface BudgetCategoryDTO {
    categoryName: string;
}

export interface MemberDTO {
    email: string;
    id: number;
    username: string;
}