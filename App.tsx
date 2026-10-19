import { useMemo, useState } from "react";
import { Sword, BookOpen, CalendarDays, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { Devotional } from "@/components/Devotional";
import { BibleReader } from "@/components/BibleReader";
import { ReadingPlan } from "@/components/ReadingPlan";
import { useSpeech } from "@/hooks/useSpeech";
import { PASSAGES, VERSIONS } from "@/data/bible";
import { DEVOTIONALS } from "@/data/devotionals";

export default function App() {
  const [tab, setTab] = useState("bible");
  const [version, setVersion] = useState("MSG");
  const [passageId, setPassageId] = useState(PASSAGES[0].id);
  const speech = useSpeech();

  const passage = useMemo(
    () => PASSAGES.find((p) => p.id === passageId) ?? PASSAGES[0],
    [passageId]
  );

  const todayDevotional = DEVOTIONALS[0];

  const speakBible = () => {
    const text = passage.verses.map((v) => `Verse ${v.n}. ${v[version]}`).join(" ");
    speech.speak(`Reading from ${version}. ${passage.reference}. ${text}`);
  };

  const speakDevotional = () => {
    const d = todayDevotional;
    speech.speak(
      `Living Stream Daily Devotional. Day ${d.day}. ${d.topic}. Main text ${d.mainText}. ${d.keyVerse} ${d.devotionalThought} Kingdom truth. ${d.kingdomTruth} Going deeper. ${d.goingDeeper} Today's application. ${d.application.join(" ")} Prayer. ${d.prayer} Declaration. ${d.declaration}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-emerald-50 font-gothic">
      <header className="border-b border-amber-500/20 bg-emerald-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <Logo size={72} />
            <div>
              <h1 className="font-gothic text-2xl font-bold tracking-wide text-amber-300 sm:text-3xl">
                PREVAILERS SWORD
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
                Parallel Bible · Living Stream
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="border-amber-400/40 bg-amber-400/10 text-amber-200">
              <Sparkles className="mr-1 h-3 w-3" /> KJV + {version}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={speech.speaking ? speech.stop : speakBible}
              className="border-amber-400/40 bg-emerald-900/40 text-amber-100 hover:bg-emerald-800/60"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              {speech.speaking ? "Stop" : "Listen"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 bg-emerald-900/50 p-1">
            <TabsTrigger value="bible" className="data-[state=active]:bg-amber-400 data-[state=active]:text-emerald-950">
              <BookOpen className="mr-2 h-4 w-4" /> Bible
            </TabsTrigger>
            <TabsTrigger value="devotional" className="data-[state=active]:bg-amber-400 data-[state=active]:text-emerald-950">
              <Sword className="mr-2 h-4 w-4" /> Devotional
            </TabsTrigger>
            <TabsTrigger value="plan" className="data-[state=active]:bg-amber-400 data-[state=active]:text-emerald-950">
              <CalendarDays className="mr-2 h-4 w-4" /> 1-Year Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bible">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Select value={version} onValueChange={setVersion}>
                <SelectTrigger className="w-48 border-amber-400/30 bg-emerald-900/50 text-amber-100">
                  <SelectValue placeholder="Parallel version" />
                </SelectTrigger>
                <SelectContent>
                  {VERSIONS.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={passageId} onValueChange={setPassageId}>
                <SelectTrigger className="w-64 border-amber-400/30 bg-emerald-900/50 text-amber-100">
                  <SelectValue placeholder="Passage" />
                </SelectTrigger>
                <SelectContent>
                  {PASSAGES.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.reference}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <BibleReader passage={passage} version={version} onListen={speakBible} speaking={speech.speaking} />
          </TabsContent>

          <TabsContent value="devotional">
            <Devotional devotional={todayDevotional} onListen={speakDevotional} speaking={speech.speaking} />
          </TabsContent>

          <TabsContent value="plan">
            <ReadingPlan />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-amber-500/20 bg-emerald-950/60 py-6 text-center text-xs text-emerald-300/70">
        <p className="font-gothic text-sm text-amber-300">Rev. Silas C. Nentawe · Snr Pst PWGAI</p>
        <p className="mt-1">PREVAILERS SWORD · Parallel Bible & Living Stream Daily Devotional</p>
      </footer>
    </div>
  );
}