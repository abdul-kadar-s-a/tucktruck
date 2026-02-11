import React from "react";

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div
            style={{
                height: "100vh",
                width: "100%",
                overflow: "hidden",
                position: "relative",
                background: "#f5f5f5",
            }}
        >
            {children}
        </div>
    );
};

export default AppLayout;
