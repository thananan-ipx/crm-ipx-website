"use client";

import { useEffect, useState } from "react";

interface User {
    name?: string;
    role?: string;
}

export default function MapperUser() {
    const [user, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);

        try {
            const userInfo = localStorage.getItem("user_info");
            if (!userInfo) return;

            const parsed = JSON.parse(userInfo);
            setUser(parsed);
        } catch {
            console.error("Invalid user_info");
        }
    }, []);

    return (
        <div className="flex flex-col gap-2">
            {/* ✅ ห้าม nested h2 */}
            <h2 className="text-3xl font-bold tracking-tight">
                Dashboard
            </h2>

            <p className="text-muted-foreground text-lg">
                {!mounted
                    ? "กำลังโหลด..."
                    : user?.name && user?.role
                        ? (
                            <>
                                ยินดีต้อนรับ{" "}
                                <strong>
                                    {user.name} [{user.role}] 👋
                                </strong>
                            </>
                        )
                        : "กำลังโหลดข้อมูล..."}
            </p>
        </div>
    );
}