---
title: 'Agent: CoachAgent'
status: done
type: feature
priority: critical
tags:
    - agent
    - coaching
    - realtime
    - core
created_at: 2025-12-17T11:00:00Z
updated_at: 2025-12-17T11:00:00Z
links:
    - parent: myHealth-agt0
---

# CoachAgent

## Beschreibung
Der Real-time Coach während des Trainings. Leitet durch Workouts, gibt Gewichtsempfehlungen, interpretiert Feedback und motiviert.

## Rolle
Der CoachAgent ist der "Personal Trainer" - er ist LIVE dabei, reagiert auf jeden Satz und passt sich an.

## Tools

### Read Tools
```typescript
get_todays_plan()
// Returns: planned workout for today

get_exercise_history(exercise_id, limit?)
// Returns: past performances for this exercise

get_current_session()
// Returns: current workout state (sets done, time elapsed)

get_user_state()
// Returns: recent sleep, last workout, mood if logged

get_exercise_details(exercise_id)
// Returns: exercise info, form cues, common mistakes
```

### Write Tools
```typescript
log_set(set_data)
// Logs a completed set

start_workout(plan_id?)
// Starts a new workout session

end_workout(session_id, notes?)
// Ends workout session

update_session(session_id, changes)
// Modify current session (add/remove exercises)
```

## Conversation Flow

### Workout starten
```
User: "Ich will trainieren"

Agent:
1. get_todays_plan() → Push Day
2. get_user_state() → 7h Schlaf, 48h seit Push

Agent: "Alright, Push Day! Du hast gut geschlafen
und bist erholt seit dem letzten Oberkörper-Training.

Heute:
1. Bankdrücken - letztes Mal 82.5kg × 9
2. Schrägbank KH
3. Schulterdrücken
4. Seitheben
5. Trizeps

Ready? Ich starte den Timer."
```

### Gewichts-Empfehlung
```
User: "Was soll ich bei Bankdrücken nehmen?"

Agent:
1. get_exercise_history('bench_press', 5)
   → Letzte 5 Sessions:
     80kg×10, 80kg×10, 82.5kg×9, 82.5kg×8, 82.5kg×9

Agent (denkt):
- Trend: Stabil bei 82.5kg, zwischen 8-9 Reps
- Kein klarer Fortschritt letzte 2 Sessions
- Aber auch kein Rückgang
- Option A: Gleich bleiben, auf 10 Reps arbeiten
- Option B: 85kg versuchen, evtl. nur 6-7 Reps

Agent: "Du warst zuletzt bei 82.5kg für 8-9 Reps.

Zwei Optionen:
• 82.5kg nochmal - versuche 10 saubere Reps
• 85kg testen - könnten 6-7 werden

Was fühlst du heute - eher Push the weight
oder erstmal die Reps hocharbeiten?"
```

### Set loggen
```
User: "85, 7 Reps, war hart"

Agent:
1. log_set({
     exercise: 'bench_press',
     weight: 85,
     reps: 7,
     rpe: 9  // interpretiert aus "war hart"
   })

Agent: "Stark! 85kg × 7 ist ein kleiner PR für dich!
Ich log das als RPE 9.

Für den nächsten Satz:
• Bei 85kg bleiben wäre gut, vielleicht 5-6 Reps
• Oder runter auf 82.5kg für solidere 8-10

Du hast noch 3 Sätze. Was machst du?"
```

### Anpassung im Workout
```
User: "Schulter tut weh, skip Schulterdrücken"

Agent:
1. update_session(session_id, {
     removed: ['overhead_press'],
     notes: 'Shoulder discomfort'
   })

Agent: "Verstanden, kein Schulterdrücken heute.

Deine Schulter-Gesundheit ist wichtiger als ein Workout.

Alternativen die die Schulter schonen:
• Mehr Seitheben (weniger Belastung)
• Facepulls (oft sogar gut für Schulter)
• Oder wir skippen Schultern komplett heute

Was klingt gut?"
```

### Workout beenden
```
User: "Fertig für heute"

Agent:
1. end_workout(session_id, {
     exercises_completed: 4,
     exercises_skipped: 1,
     total_sets: 16,
     duration: 52min
   })

Agent: "Nice Workout!

Zusammenfassung:
• 52 Minuten
• 16 Sätze, 4 Übungen
• PR bei Bankdrücken: 85kg × 7
• Schulterdrücken geskippt (Schulter)

Deine Brust und Trizeps sind jetzt durch.
Nächstes Push-Training in 3-4 Tagen.

Wie geht's der Schulter? Sollen wir das
im Auge behalten?"
```

## Echtzeit-Verhalten

### Proaktive Tipps
```
// Nach 3. Satz Bankdrücken mit sinkendem Output

Agent: "Ich seh dass die Reps runtergehen
(10 → 8 → 6). Das ist normal für Hypertrophie.

Für Satz 4: Entweder
• 80kg für 8+ Reps (mehr Volumen)
• 85kg für 4-5 (Kraft erhalten)

Kein Stress, beides ist valide!"
```

### Rest Timer
```
Agent: "Set geloggt. Rest Timer läuft.

Bei 2:00 sag Bescheid wenn du früher
ready bist, oder ich melde mich."

[2 Minuten später]

Agent: "Rest vorbei! Ready für Satz 3?"
```

### Motivational Moments
```
// Bei PR

Agent: "LETS GO! 🎉

Das war ein Personal Record!
85kg × 7 ist dein neuer Best für Bankdrücken.

Vor 8 Wochen warst du bei 75kg.
10kg Steigerung! Die Arbeit zahlt sich aus."
```

## Keine Algorithmen - Nur Kontext

Der Agent entscheidet NICHT mit Formeln wie:
```
if rpe > 8.5: weight -= 5%
```

Sondern überlegt:
- Wie war der Trend über mehrere Sessions?
- Was sagt der User (müde, motiviert)?
- Wie ist die Recovery-Situation?
- Was ist das Ziel (Kraft vs Hypertrophie)?

## Definition of Done
- [ ] Agent leitet komplettes Workout
- [ ] Gewichtsempfehlungen sind kontextbasiert
- [ ] RPE wird aus natürlicher Sprache interpretiert
- [ ] Anpassungen mid-workout möglich
- [ ] Motivationale Momente funktionieren
- [ ] KEINE hardcoded Progression-Regeln
