import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  Github,
  Twitter,
  BookOpen,
  Bug,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function SupportPage() {
  const session = await auth();

  if(!session){
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get support, report issues, or learn more about MonkArc
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Documentation */}
          <Link
            href="#"
            className="group rounded-xl bg-white border border-slate-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all"
          >
            <div className="inline-flex p-3 rounded-lg bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Documentation
            </h3>
            <p className="text-sm text-slate-600">
              Learn how to use MonkArc features and get the most out of your
              journeys
            </p>
          </Link>

          {/* Report Bug */}
          <Link
            href="https://github.com/diwashkafle/monkarc/issues/new?template=bug_report.md"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl bg-white border border-slate-200 p-6 hover:border-red-300 hover:shadow-lg transition-all"
          >
            <div className="inline-flex p-3 rounded-lg bg-red-50 text-red-600 mb-4 group-hover:bg-red-100 transition-colors">
              <Bug className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Report a Bug
            </h3>
            <p className="text-sm text-slate-600">
              {`Found something broken? Let us know and we'll fix it ASAP`}
            </p>
          </Link>

          {/* Feature Request */}
          <Link
            href="https://github.com/diwashkafle/monkarc/issues/new?template=feature_request.md"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl bg-white border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-lg transition-all"
          >
            <div className="inline-flex p-3 rounded-lg bg-emerald-50 text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Request a Feature
            </h3>
            <p className="text-sm text-slate-600">
              {`Have an idea? Share it with us and help shape MonkArc's future`}
            </p>
          </Link>

          {/* Email Support */}
          <Link
            href="mailto:diwashkafle555@gmail.com"
            className="group rounded-xl bg-white border border-slate-200 p-6 hover:border-purple-300 hover:shadow-lg transition-all"
          >
            <div className="inline-flex p-3 rounded-lg bg-purple-50 text-purple-600 mb-4 group-hover:bg-purple-100 transition-colors">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Email Support
            </h3>
            <p className="text-sm text-slate-600">
              Need personalized help? Send us an email at support@monkarc.com
            </p>
          </Link>

          {/* Community */}
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl bg-white border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="inline-flex p-3 rounded-lg bg-indigo-50 text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Join Community
            </h3>
            <p className="text-sm text-slate-600">
              Connect with other builders and get help from the community
            </p>
          </Link>

          {/* Twitter */}
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl bg-white border border-slate-200 p-6 hover:border-sky-300 hover:shadow-lg transition-all"
          >
            <div className="inline-flex p-3 rounded-lg bg-sky-50 text-sky-600 mb-4 group-hover:bg-sky-100 transition-colors">
              <Twitter className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Follow Updates
            </h3>
            <p className="text-sm text-slate-600">
              Stay updated with latest features and announcements on Twitter
            </p>
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="rounded-xl bg-white border border-slate-200 p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="h-6 w-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                How do I connect my GitHub account?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {` Go to Settings → GitHub Integration → Click "Connect GitHub". 
                You'll be redirected to authorize MonkArc to access your commit data.`}
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What happens if I miss a check-in?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {` Your journey will become "Frozen" after 3 days of inactivity and "Dead" 
                after 7 days. You can resurrect a dead journey by checking in again, 
                but your streak will be reset.`}
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Can I make my completed journeys public?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! When you complete a journey (reach Arc phase), you can
                choose to make it public. Your Arc will have a shareable URL
                that showcases your progress and achievements.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                How do I extend a journey?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {`When you reach your target check-ins, you'll enter the Arc phase. 
                At that point, you can either complete the journey or extend it by 
                adding more days to continue building.`}
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Is MonkArc free to use?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! MonkArc is completely free for now and open source. You can track
                unlimited journeys, check-ins, and GitHub commits at no cost.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            {` We're here to help! Reach out through any of the channels above 
            and we'll get back to you as soon as possible.`}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="https://github.com/diwashkafle/monkarc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </Link>
            <Link
              href="mailto:diwashkafle555@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
            >
              <Mail className="h-5 w-5" />
              Email Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
