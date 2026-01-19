import { ReactNode } from "react";

export interface NavItem {
    id: string;
    name: string;
    path?: string;
    icon: ReactNode;
    numItem?: number;
    numWishItem?: number;
}
