import { revalidatePath } from "next/cache";

export function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/privacy");
  revalidatePath("/terms");
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath("/admin/content");
  revalidatePath("/admin/media");
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/team");
  revalidatePath("/admin/settings");
}
