/**
 * CBT Campaign Module
 * Based on Safren's "Mastering Your Adult ADHD" protocol
 */

const CBTCampaign = {
    modules: [
        {
            id: 'psychoeducation',
            title: 'Understanding Your ADHD Brain',
            icon: '📖',
            sessions: 2,
            lessons: [
                {
                    id: 'psycho-1',
                    title: 'What is ADHD Really?',
                    steps: [
                        {
                            type: 'info',
                            title: 'Welcome to CBT Training',
                            content: `This program is based on proven cognitive-behavioral therapy techniques specifically designed for adults with ADHD.

You'll learn practical skills to manage your symptoms and change unhelpful thought patterns.`,
                            icon: '👋'
                        },
                        {
                            type: 'info',
                            title: 'ADHD is Neurobiological',
                            content: `ADHD is NOT a character flaw or lack of willpower.

It's a neurobiological condition affecting:
• Executive function
• Working memory
• Attention regulation
• Impulse control

Your brain is wired differently - not broken.`,
                            icon: '🧠'
                        },
                        {
                            type: 'info',
                            title: 'The Three Core Symptoms',
                            content: `ADHD has three main symptom clusters:

1. **Inattention** - Difficulty focusing, easily distracted
2. **Hyperactivity** - Restlessness, need for movement
3. **Impulsivity** - Acting without thinking

You may have all three or mainly one type.`,
                            icon: '🎯'
                        },
                        {
                            type: 'reflection',
                            title: 'Your Experience',
                            content: 'Which symptom affects you most in daily life?',
                            options: ['Inattention', 'Hyperactivity', 'Impulsivity', 'All equally']
                        },
                        {
                            type: 'reflection',
                            title: 'Practice: Analyzing a Struggle',
                            content: 'Think of a specific time this week you struggled. Which symptom was the main culprit?',
                            options: ['Inattention (zoning out)', 'Hyperactivity (restless)', 'Impulsivity (acting too fast)', 'Emotional regulation']
                        },
                        {
                            type: 'info',
                            title: 'Key Insight',
                            content: `Understanding that ADHD is neurobiological helps you:

✓ Stop blaming yourself
✓ Focus on strategies, not willpower
✓ Be compassionate with yourself
✓ Explain it to others

You're not lazy. Your brain just works differently.`,
                            icon: '💡'
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: Self-Compassion',
                            content: `When you struggle, remind yourself:

"This is my ADHD, not my character. I'm learning strategies to work WITH my brain, not against it."`,
                            saveAs: 'self-compassion'
                        }
                    ]
                },
                {
                    id: 'psycho-2',
                    title: 'How ADHD Affects Daily Life',
                    steps: [
                        {
                            type: 'info',
                            title: 'Executive Function Challenges',
                            content: `Executive functions are like your brain's CEO. ADHD affects:

• **Planning** - Organizing steps to reach a goal
• **Time Management** - Estimating how long things take
• **Working Memory** - Holding info while using it
• **Task Initiation** - Starting tasks (even important ones)
• **Emotional Regulation** - Managing frustration`,
                            icon: '🎛️'
                        },
                        {
                            type: 'reflection',
                            title: 'Identify Your Challenge',
                            content: 'Which executive function feels "weakest" for you right now?',
                            options: ['Planning', 'Time Management', 'Starting Tasks', 'Emotion Control']
                        },
                        {
                            type: 'info',
                            title: 'The Medication Factor',
                            content: `If you take ADHD medication, that's great - it's evidence-based treatment.

But medication alone often isn't enough. Research shows:

**Medication + CBT = Best Results**

CBT helps with skills medication can't teach.`,
                            icon: '💊'
                        },
                        {
                            type: 'info',
                            title: 'Why CBT Works for ADHD',
                            content: `Cognitive-Behavioral Therapy works because:

1. It teaches **concrete skills** (not just insight)
2. Uses **external supports** (calendars, reminders)
3. Addresses **negative thinking** that builds up
4. Provides **structure** ADHD brains crave
5. Includes **practice and repetition**`,
                            icon: '✨'
                        },
                        {
                            type: 'info',
                            title: 'What You\'ll Learn',
                            content: `In this program you'll master:

📋 **Organization & Planning** - Systems that stick
🎯 **Focus Techniques** - Managing distractions
💭 **Adaptive Thinking** - Challenging negative thoughts
⚡ **Procrastination Busters** - Getting started

Let's begin!`,
                            icon: '🚀'
                        },
                        {
                            type: 'complete',
                            title: 'Module Progress',
                            content: 'You completed the first lesson! You\'re building understanding of your ADHD brain.',
                            xp: 50
                        }
                    ]
                },
                {
                    id: 'psycho-3',
                    title: 'The CBT Model',
                    steps: [
                        {
                            type: 'info',
                            title: 'Thoughts → Feelings → Actions',
                            content: `The core of CBT is understanding this cycle:

**Situation** → **Thought** → **Feeling** → **Behavior**

Example:
• Situation: Forgot a meeting
• Thought: "I'm so stupid"
• Feeling: Shame, frustration
• Behavior: Avoid checking calendar

The thought drives everything!`,
                            icon: '🔄'
                        },
                        {
                            type: 'info',
                            title: 'ADHD Makes This Worse',
                            content: `Years of ADHD struggles often create:

• Negative self-image ("I'm lazy")
• Learned helplessness ("Why try?")
• Anxiety about failing again
• Avoidance of challenging tasks

CBT helps break this cycle by changing the THOUGHTS.`,
                            icon: '⚠️'
                        },
                        {
                            type: 'reflection',
                            title: 'Your Thought Patterns',
                            content: 'Which thought do you have most often?',
                            options: [
                                '"I always mess things up"',
                                '"I\'ll never be organized"',
                                '"Other people have it together, why can\'t I?"',
                                '"I\'m just lazy"'
                            ]
                        },
                        {
                            type: 'info',
                            title: 'Good News',
                            content: `These thoughts are NOT facts - they're habits.

And habits can be changed.

In the Adaptive Thinking module, you'll learn to:
• Catch automatic negative thoughts
• Challenge them with evidence
• Replace them with balanced alternatives

For now, just notice when negative thoughts appear.`,
                            icon: '💡'
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: Thought Noticing',
                            content: `When you feel frustrated or ashamed, pause and ask:

"What thought just went through my mind?"

Just noticing is the first step to change.`,
                            saveAs: 'thought-noticing'
                        }
                    ]
                },
                {
                    id: 'psycho-4',
                    title: 'Setting Up for Success',
                    steps: [
                        {
                            type: 'info',
                            title: 'How This Program Works',
                            content: `To get the most from this training:

1. **Do one lesson at a time** - Don't rush
2. **Complete the exercises** - Practice is key
3. **Use the tools daily** - They reinforce learning
4. **Be patient** - Skills take time to stick
5. **Celebrate progress** - Every step counts`,
                            icon: '📋'
                        },
                        {
                            type: 'info',
                            title: 'The Repetition Principle',
                            content: `ADHD brains need MORE repetition to encode new habits.

That's not a flaw - it's just how it works.

This app will:
• Review previous skills regularly
• Remind you to practice
• Track your consistency

Expect to revisit concepts. That's by design!`,
                            icon: '🔁'
                        },
                        {
                            type: 'info',
                            title: 'External Supports',
                            content: `ADHD brains struggle with internal cues.

So we use EXTERNAL supports:
• Alarms and reminders
• Visual calendars
• Written task lists
• Physical organization systems

These aren't crutches - they're smart accommodations.`,
                            icon: '⏰'
                        },
                        {
                            type: 'complete',
                            title: '🎉 Module 1 Complete!',
                            content: `You've finished Understanding Your ADHD Brain!

Key takeaways:
• ADHD is neurobiological, not a character flaw
• CBT + medication works better than either alone
• Thoughts drive feelings and behaviors
• External supports and repetition are essential

Next: Organization & Planning`,
                            xp: 75
                        }
                    ]
                }
            ]
        },
        {
            id: 'organization',
            title: 'Organization & Planning',
            icon: '📋',
            sessions: 2,
            lessons: [
                {
                    id: 'org-1',
                    title: 'The One Calendar Rule',
                    steps: [
                        {
                            type: 'info',
                            title: 'One System, Not Many',
                            content: `The #1 organization mistake: Using multiple systems.

"I have a work calendar, a home calendar, sticky notes, and reminders in my phone..."

Result? Things fall through the cracks.

**Solution: ONE calendar for EVERYTHING.**`,
                            icon: '📅'
                        },
                        {
                            type: 'info',
                            title: 'Why One Calendar Works',
                            content: `With one calendar:

✓ Nothing competes for attention
✓ You always know where to look
✓ No double-booking
✓ Less decision fatigue

Digital or paper? Doesn't matter. Just ONE.`,
                            icon: '✅'
                        },
                        {
                            type: 'reflection',
                            title: 'Your Current System',
                            content: 'How many places do you currently track appointments/tasks?',
                            options: ['Just one system', '2-3 systems', '4+ systems', 'No system at all']
                        },
                        {
                            type: 'info',
                            title: 'Setting Up Your Calendar',
                            content: `Pick ONE system and commit:

**Digital options:**
• Google Calendar (syncs everywhere)
• Apple Calendar
• Outlook

**Paper options:**
• Daily planner
• Wall calendar

Choose based on what you'll ACTUALLY use.`,
                            icon: '🛠️'
                        },
                        {
                            type: 'reflection',
                            title: 'Commit to a System',
                            content: 'Which calendar system are you going to use starting TODAY?',
                            options: ['Digital (Google/Apple)', 'Physical Planner', 'Wall Calendar', 'Hybrid System']
                        },
                        {
                            type: 'action',
                            title: 'Action Step',
                            content: `Right now, decide:

1. What will be your ONE calendar?
2. Where will you keep it / access it?
3. When will you check it daily?

Write this down or tell someone.`,
                            icon: '✍️'
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: One Calendar Rule',
                            content: `Every appointment, task, and reminder goes in ONE place.

Check it: Morning, midday, evening.

If it's not in the calendar, it doesn't exist.`,
                            saveAs: 'one-calendar'
                        }
                    ]
                },
                {
                    id: 'org-2',
                    title: 'Task List Mastery',
                    steps: [
                        {
                            type: 'info',
                            title: 'The Brain Dump',
                            content: `ADHD brains hold too much in working memory.

**Brain dump:** Write down EVERYTHING you need to do.

Don't organize yet. Just get it out of your head.

This frees up mental space and reduces anxiety.`,
                            icon: '🧠'
                        },
                        {
                            type: 'info',
                            title: 'The A/B/C Priority System',
                            content: `After brain dump, prioritize:

**A = Must do TODAY**
• Deadlines, appointments, urgent items

**B = Should do THIS WEEK**
• Important but flexible timing

**C = Would be NICE to do**
• Low priority, no deadline

Focus on A's first. Always.`,
                            icon: '🎯'
                        },
                        {
                            type: 'info',
                            title: 'The 15-Minute Rule',
                            content: `ADHD brains get overwhelmed by big tasks.

**Solution:** Break everything into 15-minute chunks.

"Clean house" → "Clean kitchen counter" (15 min)
"Write report" → "Write introduction" (15 min)

Small wins build momentum.`,
                            icon: '⏱️'
                        },
                        {
                            type: 'info',
                            title: 'Daily Task Limit',
                            content: `Common mistake: Planning 20 tasks per day.

**Reality:** You'll do 3-5 well.

Better to complete 3 tasks than half-finish 10.

Pick your top 3 A-priority items each morning.`,
                            icon: '3️⃣'
                        },
                        {
                            type: 'quiz',
                            title: 'Quick Check',
                            question: 'You have a deadline tomorrow (urgent) and a project due next week (important). Which is the A-Priority?',
                            options: ['The project due next week', 'The deadline tomorrow', 'Both are equal'],
                            correctIndex: 1,
                            explanation: 'A-Priorities are for things that must happen TODAY or have immediate consequences. The other project is a B-Priority.'
                        },
                        {
                            type: 'reflection',
                            title: 'Practice: Prioritizing',
                            content: 'Scenario: You have 3 tasks. Which one is the "A" priority (Must do today)?',
                            options: ['Pay overdue bill', 'Call friend to chat', 'Buy snacks for later']
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: Task Mastery',
                            content: `1. Brain dump everything
2. Mark A/B/C priority
3. Pick top 3 for today
4. Break into 15-min chunks
5. Do A's first, always`,
                            saveAs: 'task-mastery'
                        },
                        {
                            type: 'complete',
                            title: 'Lesson Complete!',
                            content: 'You now have a system for managing tasks. Use the Task Breaker tool to practice!',
                            xp: 50
                        }
                    ]
                },
                {
                    id: 'org-3',
                    title: 'Paper & Space Organization',
                    steps: [
                        {
                            type: 'info',
                            title: 'The Clutter-ADHD Connection',
                            content: `Visual clutter = mental clutter.

For ADHD brains, a messy space:
• Increases distraction
• Creates decision fatigue
• Causes "out of sight, out of mind" problems
• Triggers shame and avoidance

Organization is not just nice - it's necessary.`,
                            icon: '📦'
                        },
                        {
                            type: 'info',
                            title: 'The "Touch It Once" Rule',
                            content: `When a paper/item comes to you, decide immediately:

1. **ACT** - Do it now if under 2 min
2. **FILE** - Put in designated spot
3. **TRASH** - Delete or throw away

Don't put it in a "deal with later" pile. That pile grows forever.`,
                            icon: '☝️'
                        },
                        {
                            type: 'info',
                            title: 'Everything Has a Home',
                            content: `The key to staying organized:

**Every item has ONE designated location.**

Keys → Hook by door
Bills → Inbox folder
Phone → Same charging spot

When you use something, it returns HOME.`,
                            icon: '🏠'
                        },
                        {
                            type: 'action',
                            title: 'Quick Win',
                            content: `Choose ONE problem area right now:

• Where do you lose your keys?
• Where does paper pile up?
• What do you misplace most?

Create a HOME for that item today.`,
                            icon: '🎯'
                        },
                        {
                            type: 'complete',
                            title: '🎉 Module 2 Complete!',
                            content: `You've finished Organization & Planning!

Key skills learned:
• One calendar rule
• A/B/C priority system
• 15-minute task chunks
• Touch it once
• Everything has a home

Next: Reducing Distractibility`,
                            xp: 75
                        }
                    ]
                },
                {
                    id: 'org-project',
                    title: 'Project: The Weekend Reset',
                    steps: [
                        {
                            type: 'info',
                            title: 'Put It Into Practice',
                            content: `You've learned the theory. Now let's build a real habit.
                            
The "Weekend Reset" is a 30-minute routine to set up your week.`,
                            icon: '🚀'
                        },
                        {
                            type: 'project',
                            title: 'The Challenge',
                            content: `**Your Mission:**
1. Open your Calendar
2. Look at the next 7 days
3. Add ALL appointments/deadlines
4. Pick your "Big 3" tasks for Monday

Check the box below when you've done this.`,
                            xp: 100
                        },
                        {
                            type: 'complete',
                            title: 'Project Complete!',
                            content: 'Great job! You started the week with clarity. That reduces anxiety and cognitive load.',
                            xp: 100
                        }
                    ]
                }
            ]
        },
        {
            id: 'focus',
            title: 'Reducing Distractibility',
            icon: '🎯',
            sessions: 2,
            lessons: [
                {
                    id: 'focus-1',
                    title: 'Know Your Attention Span',
                    steps: [
                        {
                            type: 'info',
                            title: 'Your Attention Has Limits',
                            content: `Everyone has an attention span limit. For ADHD, it's often shorter.

That's okay. Knowing your limit lets you work WITH it.

Average sustained attention:
• Neurotypical: 20-45 min
• ADHD: 10-20 min (varies widely)`,
                            icon: '⏱️'
                        },
                        {
                            type: 'info',
                            title: 'Find Your Window',
                            content: `To find YOUR attention window:

1. Start a timer on a boring task
2. Note when you first feel the urge to check phone/wander
3. That's your natural window

Don't fight it - work in chunks that fit your window.`,
                            icon: '🔍'
                        },
                        {
                            type: 'reflection',
                            title: 'Estimate Your Window',
                            content: 'How long can you typically focus before getting distracted?',
                            options: ['Under 5 minutes', '5-10 minutes', '10-20 minutes', '20+ minutes']
                        },
                        {
                            type: 'info',
                            title: 'Work in Sprints',
                            content: `Instead of fighting your attention span:

1. Set timer for your window (e.g., 15 min)
2. Focus on ONE task
3. Take a 5-minute break
4. Repeat

This is called "timeboxing" or "Pomodoro" technique.`,
                            icon: '🏃'
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: Attention Sprints',
                            content: `1. Know your attention window
2. Set timer for that length
3. One task only
4. 5-min break after
5. Repeat

Use the Focus Timer tool to practice!`,
                            saveAs: 'attention-sprints'
                        }
                    ]
                },
                {
                    id: 'focus-2',
                    title: 'The Distraction Delay',
                    steps: [
                        {
                            type: 'info',
                            title: 'Distractions Will Come',
                            content: `When focusing, your brain WILL generate distracting thoughts:

"I should check email..."
"What's for dinner?"
"I wonder if they texted back..."

You can't stop these. But you can DELAY acting on them.`,
                            icon: '💭'
                        },
                        {
                            type: 'info',
                            title: 'The Parking Lot Technique',
                            content: `When a distracting thought appears:

1. **Don't act on it** - Resist the impulse
2. **Write it down** - Quick note on paper/phone
3. **Return to task** - It's "parked" for later
4. **Address after** - Handle during break

The thought is captured. It won't be forgotten. Now refocus.`,
                            icon: '🅿️'
                        },
                        {
                            type: 'reflection',
                            title: 'Practice: Distortion Delay',
                            content: 'Scenario: You are working and suddenly think "I need to email Mom". What is the best move?',
                            options: ['Stop and email her immediately', 'Write "Email Mom" on notepad & continue work', 'Try to remember it for later']
                        },
                        {
                            type: 'info',
                            title: 'Why This Works',
                            content: `Your brain generates distractions because:

• It fears forgetting important things
• It seeks novelty (dopamine!)
• It avoids boring/hard tasks

Writing it down satisfies the "don't forget" worry.
Delaying builds your impulse control muscle.`,
                            icon: '🧠'
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: Distraction Delay',
                            content: `When distracted:
1. PAUSE - Don't act on it
2. PARK IT - Write it down
3. RETURN - Back to task
4. LATER - Handle in break

Every parked distraction = win.`,
                            saveAs: 'distraction-delay'
                        }
                    ]
                },
                {
                    id: 'focus-3',
                    title: 'Environment Hacking',
                    steps: [
                        {
                            type: 'info',
                            title: 'Your Environment Matters',
                            content: `ADHD brains are highly environment-sensitive.

The right environment makes focus EASY.
The wrong environment makes it nearly impossible.

You can't always control your brain - but you CAN control your space.`,
                            icon: '🏠'
                        },
                        {
                            type: 'info',
                            title: 'Remove Temptations',
                            content: `Before starting focused work:

📱 Phone → Silent, out of reach
💻 Tabs → Close all except task-related
🔔 Notifications → Turn off
📺 TV → Off (even in background)
🚪 Door → Closed if possible

Make distraction HARDER than focus.`,
                            icon: '🚫'
                        },
                        {
                            type: 'info',
                            title: 'Add Focus Cues',
                            content: `Create signals that mean "focus time":

🎧 Specific playlist or white noise
☕ Same drink/snack
🪑 Designated "work spot"
⏱️ Visual timer on desk
📝 Task written in front of you

These cue your brain: "Time to focus."`,
                            icon: '✨'
                        },
                        {
                            type: 'action',
                            title: 'Design Your Focus Zone',
                            content: `Right now, identify:

1. Where will you do focused work?
2. What will you remove from that space?
3. What cues will signal "focus time"?

Even small changes help!`,
                            icon: '🎯'
                        },
                        {
                            type: 'complete',
                            title: '🎉 Module 3 Complete!',
                            content: `You've finished Reducing Distractibility!

Key skills:
• Know your attention window
• Work in sprints with breaks
• Park distractions, don't act
• Remove temptations
• Add focus cues

Next: Adaptive Thinking`,
                            xp: 75
                        }
                    ]
                },
                {
                    id: 'focus-project',
                    title: 'Project: The Deep Work Challenge',
                    steps: [
                        {
                            type: 'info',
                            title: 'Challenge Accepted',
                            content: 'Theory is good. Results are better.\n\nTime to prove you can hold your focus.',
                            icon: '🎯'
                        },
                        {
                            type: 'project',
                            title: '25 Minutes of Deep Work',
                            content: '**Your Mission:**\n1.  Pick a meaningful task\n2.  Set the Focus Timer for 25 minutes\n3.  Complete the session with ZERO unauthorized breaks\n\nCheck the box below when you succeed.',
                            xp: 100
                        },
                        {
                            type: 'complete',
                            title: 'Focus Master!',
                            content: 'You did it! That state of flow is where your best work happens.',
                            xp: 100
                        }
                    ]
                }
            ]
        },
        {
            id: 'adaptive',
            title: 'Adaptive Thinking',
            icon: '🧠',
            sessions: 2,
            lessons: [
                {
                    id: 'adapt-1',
                    title: 'Catching Your Thoughts',
                    steps: [
                        {
                            type: 'info',
                            title: 'Automatic Negative Thoughts',
                            content: `We all talk to ourselves constantly. For ADHDers, this "self-talk" is often harsh.

**Automatic Negative Thoughts (ANTs):**
"I always mess up."
"I'm so lazy."
"Everyone is mad at me."

These thoughts happen instantly and feel true.`,
                            icon: '🐜'
                        },
                        {
                            type: 'info',
                            title: 'Thoughts ≠ Facts',
                            content: `Just because you THINK it doesn't mean it's TRUE.

A thought is just a mental event. It's a hypothesis, not a fact.

**Fact:** You were late to work.
**Thought:** "I'm a failure who can't do anything right."

See the difference?`,
                            icon: '🔍'
                        },
                        {
                            type: 'quiz',
                            title: 'Fact vs. Thought',
                            question: 'Which of these is a FACT?',
                            options: ['"I am terrible at my job"', '"I felt overwhelmed today"', '"My boss hates me"'],
                            correctIndex: 1,
                            explanation: 'Feelings are real experiences (facts). "Terrible at job" and "boss hates me" are interpretations (thoughts).'
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: Catch the ANT',
                            content: `When you feel bad, ask:
"What am I telling myself right now?"

Identify the thought:
"I'm thinking that I'm a failure."

Labeling it creates distance.`,
                            saveAs: 'catch-ant'
                        }
                    ]
                },
                {
                    id: 'adapt-2',
                    title: 'Challenging Distortions',
                    steps: [
                        {
                            type: 'info',
                            title: 'Common Thinking Errors',
                            content: `Our brains use shortcuts that lead to errors (Cognitive Distortions):

1. **All-or-Nothing:** "If not perfect, it's a failure."
2. **Catastrophizing:** "If I'm late, I'll get fired."
3. **Mind Reading:** "They think I'm annoying."
4. **Labeling:** "I'm an idiot" vs "I made a mistake."`,
                            icon: '⚠️'
                        },
                        {
                            type: 'reflection',
                            title: 'Your Go-To Distortion',
                            content: 'Which thinking error do you use most often?',
                            options: ['All-or-Nothing (Perfect/Fail)', 'Catastrophizing (Worst Case)', 'Mind Reading (Assuming judgments)', 'Labeling (I am X)']
                        },
                        {
                            type: 'info',
                            title: 'The Evidence Method',
                            content: `To challenge a thought, act like a lawyer.

**Thought:** "I never finish anything."

**Evidence FOR:** "I have unfinished laundry."
**Evidence AGAINST:** "I finished work today. I finished dinner. I finished this lesson."

**Verdict:** "I sometimes struggle to finish, but I also complete many things."`,
                            icon: '⚖️'
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: The Lawyer',
                            content: `Put your thought on trial.

1. What is the evidence FOR this thought?
2. What is the evidence AGAINST it?
3. Is there a more balanced way to see it?`,
                            saveAs: 'lawyer-technique'
                        }
                    ]
                },
                {
                    id: 'adapt-project',
                    title: 'Project: Thought Log',
                    steps: [
                        {
                            type: 'info',
                            title: 'Track Your Thoughts',
                            content: 'The best way to change thinking is to catch it in the act.',
                            icon: '📓'
                        },
                        {
                            type: 'project',
                            title: 'Log 3 Ant-Catcher Moments',
                            content: '**Your Mission:**\nUse the Thought Challenger tool to log 3 negative thoughts this week.\n\nChallenge them and find a balanced alternative.\n\nCheck the box once you have logged 3 entries.',
                            xp: 100
                        },
                        {
                            type: 'complete',
                            title: 'Mental Ninja!',
                            content: 'You are taking control of your internal narrative. This reduces anxiety and depression significantly.',
                            xp: 100
                        }
                    ]
                }
            ]
        },
        {
            id: 'procrastination',
            title: 'Mastering Procrastination',
            icon: '⚡',
            sessions: 1,
            lessons: [
                {
                    id: 'proc-1',
                    title: 'The Wall of Awful',
                    steps: [
                        {
                            type: 'info',
                            title: 'Why We Procrastinate',
                            content: `Procrastination is NOT about laziness. It's about EMOTION regulation.

We avoid tasks that make us feel:
• Bored
• Anxious
• Incompetent
• Overwhelmed

This creates a "Wall of Awful" around the task.`,
                            icon: '🧱'
                        },
                        {
                            type: 'info',
                            title: 'Climbing the Wall',
                            content: `To do the task, you have to get over the emotional wall.

**Strategies:**
1. **Micro-steps:** Make the first step too small to fail.
2. **Body Doubling:** Work with someone else present.
3. **Dopamine Menu:** Add music/snacks to make it fun.`,
                            icon: '🧗'
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: Micro-Stepping',
                            content: `Stuck? Make the step smaller.

"Clean kitchen" (Too big)
"Wash dishes" (Still big)
"Turn on water" (Good!)

Find the step so small you feel zero resistance.`,
                            saveAs: 'micro-stepping'
                        }
                    ]
                },
                {
                    id: 'proc-2',
                    title: 'Forgive to Move Forward',
                    steps: [
                        {
                            type: 'info',
                            title: 'The Shame Spiral',
                            content: `You don't do the thing → You feel guilty → You feel ashamed → You avoid the thing to avoid the shame.
                            
This is the Procrastination Shame Spiral.
                            
Shame drains the energy you need to work.`,
                            icon: '🌀'
                        },
                        {
                            type: 'info',
                            title: 'Self-Compassion Works',
                            content: `Research (Wohl et al.) shows that students who FORGAVE themselves for procrastinating on the first exam studied MORE for the second one.
                            
Beating yourself up keeps you stuck.
Forgiveness frees you to act.`,
                            icon: '❤️'
                        },
                        {
                            type: 'reflection',
                            title: 'Practice Forgiveness',
                            content: 'Think of a task you are avoiding. Say: "I forgive myself for not doing this yet. I am doing my best."',
                            options: ['I said it and felt relief', 'I said it but it was hard', 'I\'m not ready to forgive yet']
                        },
                        {
                            type: 'skill-card',
                            title: 'Skill Card: Fresh Start',
                            content: `Every moment is a new chance to start.
                            
The past is gone. You can't change it.
                            
You can only change NOW.`,
                            saveAs: 'fresh-start'
                        }
                    ]
                },
                {
                    id: 'proc-project',
                    title: 'Project: Task Breaker',
                    steps: [
                        {
                            type: 'info',
                            title: 'Slay the Dragon',
                            content: 'Pick that one task you have been avoiding for weeks.',
                            icon: '🐉'
                        },
                        {
                            type: 'project',
                            title: 'Use the Task Breaker',
                            content: '**Your Mission:**\n1. Open the Task Breaker tool\n2. Enter your "Impossible Task"\n3. Let the AI (or template) break it down\n4. Do the FIRST micro-step immediately.\n\nCheck box when done.',
                            xp: 150
                        },
                        {
                            type: 'complete',
                            title: 'Dragon Slayer!',
                            content: 'Action is the antidote to despair. You broke the paralysis!',
                            xp: 100
                        }
                    ]
                }
            ]
        }
    ],

    getLesson(lessonId) {
        for (const module of this.modules) {
            const lesson = module.lessons.find(l => l.id === lessonId);
            if (lesson) return lesson;
        }
        return null;
    },

    isModuleUnlocked(index) {
        // Module 0 is always unlocked
        if (index === 0) return true;

        // Check if previous module is complete
        const prevModule = this.modules[index - 1];
        if (!prevModule) return true;

        return this.getModuleCompletion(prevModule.id) >= 100;
    },

    getModuleCompletion(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return 0;

        const progress = this.getProgress();
        let completedCount = 0;

        module.lessons.forEach(lesson => {
            if (progress.completedLessons.includes(lesson.id)) {
                completedCount++;
            }
        });

        return (completedCount / module.lessons.length) * 100;
    },

    /**
     * Get progress
     */
    getProgress() {
        const data = localStorage.getItem('adhd_cbt_campaign');
        return data ? JSON.parse(data) : {
            completedLessons: [],
            skillCards: []
        };
    },

    /**
     * Save progress
     */
    saveProgress(progress) {
        localStorage.setItem('adhd_cbt_campaign', JSON.stringify(progress));
    },

    /**
     * Complete a lesson
     */
    completeLesson(lessonId, xpReward) {
        const progress = this.getProgress();
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            this.saveProgress(progress);
        }

        // Award XP
        if (window.XPSystem) {
            XPSystem.addXP(xpReward, 'CBT Lesson Complete');
            XPSystem.incrementStat('cbtLessons');
            // Quest completion handled in App.js or here
            XPSystem.completeQuest('cbt-lesson');
        }
    },

    /**
     * Save a skill card
     */
    saveSkillCard(cardId, content) {
        const progress = this.getProgress();
        // Check if already saved
        if (!progress.skillCards.some(c => c.id === cardId)) {
            progress.skillCards.push({
                id: cardId,
                content: content,
                date: new Date().toISOString()
            });
            this.saveProgress(progress);

            if (window.App) {
                App.showToast('New Skill Card Unlocked! 🃏');
            }
        }
    }
};

window.CBTCampaign = CBTCampaign;
