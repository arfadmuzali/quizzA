import Link from "next/link";

export default function Footer() {
  return (
    <div className="border-t mt-4 border-slate-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Arfad Muzali. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="https://github.com/arfadmuzali"
              className="text-sm text-slate-600 hover:text-orange-500 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/arfad-muzali-91a16a2a7?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bec7XjP3mQrul9OvtGKL6IA%3D%3D"
              className="text-sm text-slate-600 hover:text-orange-500 transition-colors"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
