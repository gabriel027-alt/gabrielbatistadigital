import { redirect } from "next/navigation";

/** The editorial portfolio became the homepage on 12/11/2026; the old review address now points to it. */
export default function EditorialPortfolioRedirect() {
  redirect("/");
}