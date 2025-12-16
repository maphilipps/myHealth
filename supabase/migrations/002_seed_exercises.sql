-- =====================================================
-- Exercise Library Seed Data
-- =====================================================

INSERT INTO exercises (name, name_de, muscle_group, secondary_muscles, equipment, exercise_type, difficulty, form_cues, weight_increment_kg) VALUES

-- CHEST
('Bench Press', 'Bankdrücken', 'chest', ARRAY['triceps', 'shoulders'], 'barbell', 'compound', 'intermediate',
 ARRAY['Schulterblätter zusammen', 'Füße fest am Boden', 'Kontrolliert absenken', 'Ellbogen 45° zum Körper'], 2.5),

('Incline Bench Press', 'Schrägbankdrücken', 'chest', ARRAY['triceps', 'shoulders'], 'barbell', 'compound', 'intermediate',
 ARRAY['Bank auf 30-45°', 'Schulterblätter fixiert', 'Stange zur oberen Brust'], 2.5),

('Dumbbell Bench Press', 'Kurzhantel Bankdrücken', 'chest', ARRAY['triceps', 'shoulders'], 'dumbbell', 'compound', 'beginner',
 ARRAY['Hanteln auf Brusthöhe', 'Volle ROM nutzen', 'Kontrollierte Bewegung'], 2.5),

('Cable Fly', 'Kabelzug Flys', 'chest', ARRAY['shoulders'], 'cable', 'isolation', 'beginner',
 ARRAY['Leichte Beugung im Ellbogen', 'Bewegung aus der Brust', 'Squeeze am Ende'], 2.5),

('Push-Up', 'Liegestütze', 'chest', ARRAY['triceps', 'shoulders', 'core'], 'bodyweight', 'compound', 'beginner',
 ARRAY['Körper gerade halten', 'Ellbogen nah am Körper', 'Volle ROM'], 0),

('Dips', 'Dips', 'chest', ARRAY['triceps', 'shoulders'], 'bodyweight', 'compound', 'intermediate',
 ARRAY['Leicht nach vorne lehnen für Brust', 'Kontrolliert absenken', 'Nicht zu tief'], 0),

-- BACK
('Deadlift', 'Kreuzheben', 'back', ARRAY['hamstrings', 'glutes', 'core'], 'barbell', 'compound', 'advanced',
 ARRAY['Rücken gerade', 'Stange nah am Körper', 'Hüfte und Knie gleichzeitig strecken', 'Core anspannen'], 5.0),

('Barbell Row', 'Langhantelrudern', 'back', ARRAY['biceps', 'rear_delts'], 'barbell', 'compound', 'intermediate',
 ARRAY['45° Oberkörperneigung', 'Ellbogen nah am Körper', 'Zur Hüfte ziehen', 'Schulterblätter zusammen'], 2.5),

('Pull-Up', 'Klimmzüge', 'back', ARRAY['biceps', 'rear_delts'], 'bodyweight', 'compound', 'intermediate',
 ARRAY['Schulterbreit greifen', 'Aus dem Rücken ziehen', 'Kinn über die Stange', 'Kontrolliert ablassen'], 0),

('Lat Pulldown', 'Latzug', 'back', ARRAY['biceps', 'rear_delts'], 'cable', 'compound', 'beginner',
 ARRAY['Schulterbreit greifen', 'Zur Brust ziehen', 'Ellbogen nach unten', 'Schulterblätter zusammen'], 2.5),

('Cable Row', 'Kabelrudern', 'back', ARRAY['biceps', 'rear_delts'], 'cable', 'compound', 'beginner',
 ARRAY['Rücken gerade', 'Zum Bauch ziehen', 'Schulterblätter zusammen', 'Kontrolliert zurück'], 2.5),

('Face Pull', 'Face Pull', 'back', ARRAY['rear_delts', 'rotator_cuff'], 'cable', 'isolation', 'beginner',
 ARRAY['Seil zum Gesicht ziehen', 'Ellbogen hoch', 'Externe Rotation am Ende', 'Schulterblätter zusammen'], 2.5),

-- SHOULDERS
('Overhead Press', 'Schulterdrücken', 'shoulders', ARRAY['triceps', 'upper_chest'], 'barbell', 'compound', 'intermediate',
 ARRAY['Core anspannen', 'Stange vor dem Gesicht', 'Lockout oben', 'Nicht ins Hohlkreuz'], 2.5),

('Dumbbell Shoulder Press', 'Kurzhantel Schulterdrücken', 'shoulders', ARRAY['triceps'], 'dumbbell', 'compound', 'beginner',
 ARRAY['Neutrale oder pronierte Griffhaltung', 'Kontrolliert drücken', 'Nicht ins Hohlkreuz'], 2.5),

('Lateral Raise', 'Seitheben', 'shoulders', ARRAY[]::TEXT[], 'dumbbell', 'isolation', 'beginner',
 ARRAY['Leichte Beugung im Ellbogen', 'Bis Schulterhöhe heben', 'Kontrolliert absenken', 'Nicht schwingen'], 1.25),

('Rear Delt Fly', 'Reverse Flys', 'shoulders', ARRAY['upper_back'], 'dumbbell', 'isolation', 'beginner',
 ARRAY['Oberkörper parallel zum Boden', 'Arme seitlich heben', 'Schulterblätter zusammen'], 1.25),

-- LEGS
('Squat', 'Kniebeuge', 'legs', ARRAY['glutes', 'core'], 'barbell', 'compound', 'intermediate',
 ARRAY['Füße schulterbreit', 'Knie über Zehen', 'Tiefe: Hüfte unter Knie', 'Rücken gerade', 'Core fest'], 5.0),

('Front Squat', 'Frontkniebeuge', 'legs', ARRAY['glutes', 'core'], 'barbell', 'compound', 'advanced',
 ARRAY['Ellbogen hoch', 'Stange auf Schultern', 'Aufrechter Oberkörper', 'Tiefe gehen'], 5.0),

('Leg Press', 'Beinpresse', 'legs', ARRAY['glutes'], 'machine', 'compound', 'beginner',
 ARRAY['Füße schulterbreit', 'Knie nicht überstrecken', 'Kontrolliert absenken', 'Rücken anliegend'], 5.0),

('Romanian Deadlift', 'Rumänisches Kreuzheben', 'legs', ARRAY['glutes', 'lower_back'], 'barbell', 'compound', 'intermediate',
 ARRAY['Leichte Kniebeugung', 'Hüfte nach hinten', 'Rücken gerade', 'Dehnung in Hamstrings'], 2.5),

('Leg Curl', 'Beinbeuger', 'legs', ARRAY[]::TEXT[], 'machine', 'isolation', 'beginner',
 ARRAY['Kontrollierte Bewegung', 'Volle ROM', 'Nicht schwingen'], 2.5),

('Leg Extension', 'Beinstrecker', 'legs', ARRAY[]::TEXT[], 'machine', 'isolation', 'beginner',
 ARRAY['Kontrollierte Bewegung', 'Nicht überstrecken', 'Spannung halten'], 2.5),

('Calf Raise', 'Wadenheben', 'legs', ARRAY[]::TEXT[], 'machine', 'isolation', 'beginner',
 ARRAY['Volle ROM', 'Pause oben', 'Kontrolliert absenken', 'Dehnung unten'], 2.5),

('Bulgarian Split Squat', 'Bulgarische Kniebeuge', 'legs', ARRAY['glutes', 'core'], 'dumbbell', 'compound', 'intermediate',
 ARRAY['Hinterer Fuß erhöht', 'Knie über Zehen', 'Aufrechter Oberkörper', 'Tiefe gehen'], 2.5),

-- ARMS
('Barbell Curl', 'Langhantel Curls', 'arms', ARRAY[]::TEXT[], 'barbell', 'isolation', 'beginner',
 ARRAY['Ellbogen fixiert', 'Nicht schwingen', 'Kontrolliert absenken', 'Volle Kontraktion'], 2.5),

('Hammer Curl', 'Hammer Curls', 'arms', ARRAY['forearms'], 'dumbbell', 'isolation', 'beginner',
 ARRAY['Neutraler Griff', 'Ellbogen fixiert', 'Abwechselnd oder gleichzeitig'], 1.25),

('Tricep Pushdown', 'Trizepsdrücken', 'arms', ARRAY[]::TEXT[], 'cable', 'isolation', 'beginner',
 ARRAY['Ellbogen fixiert', 'Volle Extension', 'Kontrolliert zurück'], 2.5),

('Skull Crusher', 'Skull Crusher', 'arms', ARRAY[]::TEXT[], 'barbell', 'isolation', 'intermediate',
 ARRAY['Ellbogen fixiert', 'Zur Stirn absenken', 'Kontrollierte Bewegung'], 2.5),

('Overhead Tricep Extension', 'Überkopf Trizepsstrecker', 'arms', ARRAY[]::TEXT[], 'dumbbell', 'isolation', 'beginner',
 ARRAY['Ellbogen nah am Kopf', 'Volle ROM', 'Kontrolliert'], 1.25),

-- CORE
('Plank', 'Unterarmstütz', 'core', ARRAY['shoulders'], 'bodyweight', 'isolation', 'beginner',
 ARRAY['Körper gerade', 'Core anspannen', 'Nicht durchhängen', 'Gleichmäßig atmen'], 0),

('Cable Crunch', 'Kabel Crunches', 'core', ARRAY[]::TEXT[], 'cable', 'isolation', 'beginner',
 ARRAY['Hüfte fixiert', 'Aus dem Bauch einrollen', 'Kontrolliert zurück'], 2.5),

('Hanging Leg Raise', 'Hängendes Beinheben', 'core', ARRAY['hip_flexors'], 'bodyweight', 'compound', 'intermediate',
 ARRAY['Nicht schwingen', 'Kontrolliert heben', 'Beine gestreckt oder gebeugt'], 0),

('Ab Wheel Rollout', 'Ab Wheel', 'core', ARRAY['shoulders', 'back'], 'ab_wheel', 'compound', 'advanced',
 ARRAY['Core fest anspannen', 'Kontrolliert ausrollen', 'Nicht durchhängen'], 0),

-- CARDIO
('Treadmill', 'Laufband', 'cardio', ARRAY[]::TEXT[], 'machine', 'cardio', 'beginner',
 ARRAY['Aufrechte Haltung', 'Natürlicher Schritt', 'Arme mitschwingen'], 0),

('Rowing Machine', 'Rudergerät', 'cardio', ARRAY['back', 'legs', 'arms'], 'machine', 'cardio', 'beginner',
 ARRAY['Beine-Rücken-Arme Reihenfolge', 'Rücken gerade', 'Volle Extension'], 0),

('Cycling', 'Fahrrad', 'cardio', ARRAY['legs'], 'machine', 'cardio', 'beginner',
 ARRAY['Sattelhöhe anpassen', 'Gleichmäßig treten', 'Nicht zu hoher Widerstand'], 0),

('Stairmaster', 'Treppensteiger', 'cardio', ARRAY['legs', 'glutes'], 'machine', 'cardio', 'beginner',
 ARRAY['Aufrechte Haltung', 'Nicht abstützen', 'Gleichmäßiges Tempo'], 0);
