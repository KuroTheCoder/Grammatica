"use client";
import { useEffect } from "react";

export default function HtmlClassFixer() {
    useEffect(() => {
        document.documentElement.classList.add("mdl-js");
    }, []);

    return null;
}
