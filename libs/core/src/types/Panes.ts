import { Component } from "react";

export interface PanesItem {
    title: string;
    content: Component;
    key: string;
    closable: boolean;
    path: string;
}