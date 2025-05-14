import { useState, useEffect } from "react";

export const useFetchCategories = () => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`,{
                    method: "GET",
                    credentials: "include", // Include cookies
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }

                const data: CategoryDTO[] = await response.json();
                setCategories(data); // Store the full category objects, including `id`
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};

export interface CategoryDTO {
    id: number;
    name: string;
    userId: number | null;
    isGlobal: boolean;
    transactionIds: number[];
}