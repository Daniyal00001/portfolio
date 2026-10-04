"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Send, Phone, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { sendContactMessage } from "@/actions/messages"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mydata } from "@/lib/data"
import { useSiteContent } from "@/components/site-content"

export function Contact() {
   const { profile, content } = useSiteContent()
   const publicEmail = profile?.email || Mydata.Email
   const publicPhone = profile?.phone || content.phone
   const formRef = React.useRef(null)
   const [sending, setSending] = React.useState(false)

   const sendMessage = async (e) => {
      e.preventDefault()
      if (sending) return

      const formData = new FormData(formRef.current)
      setSending(true)
      const result = await sendContactMessage({
         name: formData.get("from_name"),
         email: formData.get("from_email"),
         message: formData.get("message"),
      })
      setSending(false)

      if (!result.success) {
         toast.error(result.error || "Could not send your message.")
         return
      }

      toast.success("Message sent. I'll get back to you soon.")
      formRef.current?.reset()
   }

   return (
      <section id="contact" className="relative container py-12 md:py-24 lg:py-32">
         {/* Spotlight Background */}
         <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mix-blend-screen">
            <div className="w-[1000px] h-[800px] bg-primary/10 blur-[150px] rounded-full translate-y-1/4 text-transparent" />
         </div>

         <div className="relative flex flex-col items-center gap-4 text-center mb-16 z-10">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5 }}
               viewport={{ once: true }}
            >
               <h2 className="font-display text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl border-b-4 border-primary pb-2 inline-block">
                  {content.contactTitle}
               </h2>
            </motion.div>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
               {content.contactBody}
            </p>
         </div>

         <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto z-10">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5 }}
               viewport={{ once: true }}
               className="space-y-8"
            >
               <div className="space-y-6">
                  <h3 className="text-2xl font-bold font-display text-foreground">{content.contactInfoTitle}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                     {content.contactInfoBody}
                  </p>

                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 rounded-lg bg-card/80 backdrop-blur-xl border border-border hover:border-primary/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <Mail className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-muted-foreground">Email</p>
                           <a href={`mailto:${publicEmail}`} className="text-foreground font-semibold hover:text-primary transition-colors">{publicEmail}</a>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-4 rounded-lg bg-card/80 backdrop-blur-xl border border-border hover:border-primary/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <Phone className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-muted-foreground">Phone</p>
                           <a href={`tel:${publicPhone.replace(/\s/g, "")}`} className="text-foreground font-semibold hover:text-primary transition-colors">{publicPhone}</a>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-4 rounded-lg bg-card/80 backdrop-blur-xl border border-border hover:border-primary/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                           <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="text-foreground font-semibold hover:text-primary transition-colors">{content.whatsappLabel}</a>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-4 rounded-lg bg-card/80 backdrop-blur-xl border border-border hover:border-primary/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                           <p className="text-foreground font-semibold">{content.responseTime}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               viewport={{ once: true }}
            >
               <Card className="border border-border shadow-[0_4px_24px_-6px_color-mix(in_oklch,var(--primary)_5%,transparent)] bg-card/80 backdrop-blur-xl">
                  <CardHeader>
                     <CardTitle>Send a Message</CardTitle>
                     <CardDescription>
                        Fill out the form below and I&apos;ll get back to you.
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <form ref={formRef} onSubmit={sendMessage} className="space-y-4">
                        <div className="grid gap-2">
                           <Label htmlFor="from_name">Name</Label>
                           <Input id="from_name" name="from_name" placeholder="Your name" required className="bg-card/80 border-border focus-visible:ring-primary" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="from_email">Email</Label>
                           <Input id="from_email" name="from_email" type="email" placeholder="your@email.com" required className="bg-card/80 border-border focus-visible:ring-primary" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="message">Message</Label>
                           <Textarea id="message" name="message" placeholder="Tell me about your project..." className="min-h-[120px] bg-card/80 border-border focus-visible:ring-primary" required />
                        </div>

                        <Button type="submit" disabled={sending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                           {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                           {sending ? "Sending..." : "Send Message"}
                        </Button>
                     </form>
                  </CardContent>
               </Card>
            </motion.div>
         </div>
      </section>
   )
}
