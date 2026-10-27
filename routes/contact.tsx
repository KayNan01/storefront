import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { SupportPage } from "@/components/trove/SupportPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SUPPORT_EMAIL, SUPPORT_RESPONSE_TIME, contactEmailUrl } from "@/lib/support";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Contact Us | Trove" },
      {
        name: "description",
        content:
          "Contact Trove at support@trove.example for order, delivery and return questions. Our team typically responds within 24 hours, Monday–Friday.",
      },
      { property: "og:title", content: "Contact Us | Trove" },
      {
        property: "og:description",
        content: "Get support for your trove.example order, shipping or returns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [opened, setOpened] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = contactEmailUrl(values);
    setOpened(true);
  }
  return (
    <SupportPage title="Contact Us">
      <div>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex items-center gap-2 break-all font-semibold text-primary hover:underline"
        >
          <Mail className="h-5 w-5 shrink-0" />
          {SUPPORT_EMAIL}
        </a>
        <p className="mt-3 text-muted-foreground">{SUPPORT_RESPONSE_TIME}</p>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2 font-medium">
            Name
            <Input
              required
              maxLength={100}
              autoComplete="name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </label>
          <label className="block space-y-2 font-medium">
            Email
            <Input
              required
              type="email"
              maxLength={254}
              autoComplete="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </label>
        </div>
        <label className="block space-y-2 font-medium">
          Subject
          <Input
            required
            maxLength={150}
            value={values.subject}
            onChange={(e) => setValues({ ...values, subject: e.target.value })}
          />
        </label>
        <label className="block space-y-2 font-medium">
          Message
          <Textarea
            required
            rows={6}
            maxLength={3000}
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
          />
        </label>
        <Button type="submit" size="lg">
          <Mail />
          Continue in email
        </Button>
        {opened && (
          <p role="status" className="text-sm text-muted-foreground">
            Your email draft is ready. Send it from your email app to reach Trove support. If your
            email app did not open, email{" "}
            <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>{" "}
            directly.
          </p>
        )}
      </form>
    </SupportPage>
  );
}
