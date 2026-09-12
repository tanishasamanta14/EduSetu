/* ============================================================
   EduSetu — Mock Quiz Data
   5 multiple-choice questions per concept.
   Each wrong option has a misconceptionTag and explanation.
   
   In production, this would come from a database/API.
   ============================================================ */

const QUIZZES = {

  /* ---- MATH ---- */
  "fractions": [
    {
      question: "What is 2/5 + 1/5?",
      options: [
        { text: "3/5", correct: true },
        { text: "3/10", correct: false, misconceptionTag: "denominator-addition", explanation: "When adding fractions with the same denominator, keep the denominator the same — don't add them together." },
        { text: "2/10", correct: false, misconceptionTag: "numerator-multiply", explanation: "You should add the numerators (2+1=3), not multiply them." },
        { text: "1/5", correct: false, misconceptionTag: "subtraction-instead", explanation: "This is subtraction, not addition. 2/5 + 1/5 = 3/5." }
      ]
    },
    {
      question: "Simplify: 6/8",
      options: [
        { text: "3/4", correct: true },
        { text: "2/4", correct: false, misconceptionTag: "wrong-division", explanation: "Divide both numerator and denominator by their GCD (2). 6÷2=3, 8÷2=4." },
        { text: "6/4", correct: false, misconceptionTag: "only-denominator", explanation: "You must simplify both the numerator and the denominator, not just one." },
        { text: "1/2", correct: false, misconceptionTag: "over-simplification", explanation: "6/8 simplified is 3/4, not 1/2. Check: 3×2=6, 4×2=8." }
      ]
    },
    {
      question: "Which fraction is larger: 3/4 or 2/3?",
      options: [
        { text: "3/4", correct: true },
        { text: "2/3", correct: false, misconceptionTag: "numerator-comparison", explanation: "You can't compare fractions by numerators alone. Convert to common denominator: 9/12 > 8/12." },
        { text: "They are equal", correct: false, misconceptionTag: "false-equivalence", explanation: "3/4 = 0.75 and 2/3 ≈ 0.667. They are not equal." },
        { text: "Cannot be compared", correct: false, misconceptionTag: "comparison-confusion", explanation: "Fractions can always be compared — find a common denominator or convert to decimals." }
      ]
    },
    {
      question: "What is 1/3 × 3/4?",
      options: [
        { text: "3/12 or 1/4", correct: true },
        { text: "4/7", correct: false, misconceptionTag: "addition-instead", explanation: "To multiply fractions, multiply numerators and denominators separately. Don't add them." },
        { text: "3/3", correct: false, misconceptionTag: "cross-multiply-error", explanation: "Cross multiplication is for comparing or solving equations, not for multiplying fractions." },
        { text: "1/12", correct: false, misconceptionTag: "numerator-error", explanation: "Multiply numerators: 1×3=3. Multiply denominators: 3×4=12. So it's 3/12 = 1/4." }
      ]
    },
    {
      question: "Convert 7/4 to a mixed number.",
      options: [
        { text: "1 ¾", correct: true },
        { text: "4/7", correct: false, misconceptionTag: "reciprocal-confusion", explanation: "You need to divide 7 by 4, not flip the fraction. 7÷4 = 1 remainder 3, so 1 ¾." },
        { text: "3 ¼", correct: false, misconceptionTag: "division-error", explanation: "7 divided by 4 is 1 with remainder 3, not 3 with remainder 1." },
        { text: "1 ⅔", correct: false, misconceptionTag: "remainder-error", explanation: "The remainder is 3 (from 7-4), and the denominator stays 4. So it's 1 ¾." }
      ]
    }
  ],

  "algebraic-expressions": [
    {
      question: "Simplify: 3x + 5x − 2",
      options: [
        { text: "8x − 2", correct: true },
        { text: "8x + 2", correct: false, misconceptionTag: "sign-error", explanation: "Check the sign of the constant term — it stays −2, it doesn't flip." },
        { text: "8x²", correct: false, misconceptionTag: "term-combination-error", explanation: "You can only combine like terms — '2' is a constant, not an x term. Also, x + x = 2x, not x²." },
        { text: "16x", correct: false, misconceptionTag: "ignored-constant", explanation: "Don't forget the constant term −2 in your final answer." }
      ]
    },
    {
      question: "If x = 3, what is the value of 2x² + 1?",
      options: [
        { text: "19", correct: true },
        { text: "37", correct: false, misconceptionTag: "order-of-operations", explanation: "First square x (3²=9), then multiply by 2 (18), then add 1 (19). Don't do (2×3)² + 1." },
        { text: "13", correct: false, misconceptionTag: "exponent-ignored", explanation: "Remember x² means x×x. So 3² = 9, not 3. Then 2×9+1=19." },
        { text: "7", correct: false, misconceptionTag: "coefficient-ignored", explanation: "Don't forget the coefficient 2. It's 2×(3²)+1 = 2×9+1 = 19." }
      ]
    },
    {
      question: "Expand: 2(x + 4)",
      options: [
        { text: "2x + 8", correct: true },
        { text: "2x + 4", correct: false, misconceptionTag: "incomplete-distribution", explanation: "You must multiply 2 by both terms inside the bracket. 2×4 = 8, not 4." },
        { text: "x + 8", correct: false, misconceptionTag: "dropped-coefficient", explanation: "The 2 multiplies the x term too. 2 × x = 2x." },
        { text: "2x + 6", correct: false, misconceptionTag: "arithmetic-error", explanation: "2 × 4 = 8, not 6. Double-check your multiplication." }
      ]
    },
    {
      question: "Which is a like term to 5xy?",
      options: [
        { text: "−3xy", correct: true },
        { text: "5x", correct: false, misconceptionTag: "variable-mismatch", explanation: "Like terms must have the same variables with the same powers. 5x and 5xy have different variables." },
        { text: "5x²y", correct: false, misconceptionTag: "power-mismatch", explanation: "The power of x must also match. xy and x²y are different." },
        { text: "xy²", correct: false, misconceptionTag: "power-of-y-error", explanation: "xy and xy² are not like terms because y has a different power." }
      ]
    },
    {
      question: "Simplify: 4a − 2b + 3a + 5b",
      options: [
        { text: "7a + 3b", correct: true },
        { text: "10ab", correct: false, misconceptionTag: "unlike-term-merge", explanation: "You cannot combine 'a' terms and 'b' terms together. They are unlike terms." },
        { text: "7a − 3b", correct: false, misconceptionTag: "sign-error", explanation: "−2b + 5b = +3b, not −3b. Check the signs carefully." },
        { text: "a + 3b", correct: false, misconceptionTag: "subtraction-error", explanation: "4a + 3a = 7a, not a. Add the coefficients: 4+3=7." }
      ]
    }
  ],

  "linear-equations": [
    {
      question: "Solve: x + 5 = 12",
      options: [
        { text: "x = 7", correct: true },
        { text: "x = 17", correct: false, misconceptionTag: "wrong-operation", explanation: "To isolate x, subtract 5 from both sides, don't add. 12 − 5 = 7." },
        { text: "x = 5", correct: false, misconceptionTag: "incomplete-solving", explanation: "You need to find x such that x + 5 = 12. Subtract 5: x = 12 − 5 = 7." },
        { text: "x = 60", correct: false, misconceptionTag: "multiplication-instead", explanation: "Subtract 5 from 12, don't multiply. x = 12 − 5 = 7." }
      ]
    },
    {
      question: "Solve: 3x = 18",
      options: [
        { text: "x = 6", correct: true },
        { text: "x = 15", correct: false, misconceptionTag: "subtraction-instead", explanation: "3x means 3 times x. Divide by 3 to get x, don't subtract. 18 ÷ 3 = 6." },
        { text: "x = 54", correct: false, misconceptionTag: "wrong-operation", explanation: "Divide both sides by 3, don't multiply. 18 ÷ 3 = 6." },
        { text: "x = 21", correct: false, misconceptionTag: "addition-instead", explanation: "To isolate x from 3x, divide by 3. 18 ÷ 3 = 6." }
      ]
    },
    {
      question: "Solve: 2x − 3 = 7",
      options: [
        { text: "x = 5", correct: true },
        { text: "x = 2", correct: false, misconceptionTag: "order-error", explanation: "First add 3 to both sides (2x = 10), then divide by 2 (x = 5)." },
        { text: "x = 8", correct: false, misconceptionTag: "missed-division", explanation: "After adding 3: 2x = 10. Now divide both sides by 2: x = 5, not 10−2." },
        { text: "x = −5", correct: false, misconceptionTag: "sign-error", explanation: "Adding 3 to both sides gives 2x = 10 (positive). Then x = 5 (positive)." }
      ]
    },
    {
      question: "Which equation has the solution x = 4?",
      options: [
        { text: "2x + 1 = 9", correct: true },
        { text: "x − 4 = 4", correct: false, misconceptionTag: "verification-error", explanation: "If x=4: 4−4=0, not 4. Always verify by substituting back." },
        { text: "3x = 9", correct: false, misconceptionTag: "verification-error", explanation: "If x=4: 3×4=12, not 9. The solution to 3x=9 is x=3." },
        { text: "x/2 = 4", correct: false, misconceptionTag: "equation-solving-error", explanation: "If x=4: 4/2=2, not 4. The solution to x/2=4 is x=8." }
      ]
    },
    {
      question: "Solve: x/4 + 2 = 5",
      options: [
        { text: "x = 12", correct: true },
        { text: "x = 3", correct: false, misconceptionTag: "forgot-multiply-back", explanation: "After subtracting 2: x/4 = 3. Now multiply both sides by 4: x = 12, not 3." },
        { text: "x = 28", correct: false, misconceptionTag: "wrong-operation-order", explanation: "First subtract 2 (x/4 = 3), then multiply by 4 (x = 12). Don't multiply 5×4 first." },
        { text: "x = 7", correct: false, misconceptionTag: "mixed-operations", explanation: "Subtract 2 first: x/4 = 3. Then multiply by 4: x = 12." }
      ]
    }
  ],

  "ratios": [
    {
      question: "Express the ratio 15:25 in simplest form.",
      options: [
        { text: "3:5", correct: true },
        { text: "1:2", correct: false, misconceptionTag: "wrong-gcd", explanation: "Divide both by 5 (not 15). 15÷5=3, 25÷5=5. The ratio is 3:5." },
        { text: "5:3", correct: false, misconceptionTag: "reversed-ratio", explanation: "Keep the order! 15 comes first, so it's 3:5, not 5:3." },
        { text: "15:25", correct: false, misconceptionTag: "unsimplified", explanation: "Both numbers share a factor of 5. Always simplify ratios: 15÷5 : 25÷5 = 3:5." }
      ]
    },
    {
      question: "If 3:4 = x:20, find x.",
      options: [
        { text: "15", correct: true },
        { text: "12", correct: false, misconceptionTag: "added-instead", explanation: "Use cross multiplication: 3×20 = 4×x, so x = 60÷4 = 15." },
        { text: "5", correct: false, misconceptionTag: "divided-wrong", explanation: "4 was multiplied by 5 to get 20, so multiply 3 by 5 too: 3×5 = 15." },
        { text: "17", correct: false, misconceptionTag: "added-difference", explanation: "Ratios are multiplicative, not additive. 20÷4=5, so x=3×5=15." }
      ]
    },
    {
      question: "Divide 35 in the ratio 2:3.",
      options: [
        { text: "14 and 21", correct: true },
        { text: "15 and 20", correct: false, misconceptionTag: "equal-distribution-bias", explanation: "Total parts = 2+3=5. Each part = 35÷5=7. So 2×7=14 and 3×7=21." },
        { text: "10 and 25", correct: false, misconceptionTag: "arbitrary-split", explanation: "Find value of one part first: 35÷5=7. Then 2 parts=14, 3 parts=21." },
        { text: "17 and 18", correct: false, misconceptionTag: "halving-bias", explanation: "Don't just split near the middle. Use the ratio: 2/(2+3) × 35 = 14." }
      ]
    },
    {
      question: "A recipe uses flour and sugar in the ratio 5:2. If you use 300g flour, how much sugar?",
      options: [
        { text: "120g", correct: true },
        { text: "150g", correct: false, misconceptionTag: "halving-error", explanation: "300÷5=60 per part. Sugar = 2×60 = 120g, not 300÷2." },
        { text: "200g", correct: false, misconceptionTag: "ratio-reversal", explanation: "Sugar is the smaller quantity (ratio 2). 300÷5=60 per part. Sugar=2×60=120g." },
        { text: "60g", correct: false, misconceptionTag: "single-part", explanation: "Sugar has 2 parts, not 1. One part=300÷5=60, so sugar=2×60=120g." }
      ]
    },
    {
      question: "Are the ratios 4:6 and 6:9 equivalent?",
      options: [
        { text: "Yes, both simplify to 2:3", correct: true },
        { text: "No, the numbers are different", correct: false, misconceptionTag: "surface-comparison", explanation: "Simplify both: 4:6 = 2:3 and 6:9 = 2:3. They're equivalent!" },
        { text: "Yes, because 4+6 = 6+4", correct: false, misconceptionTag: "wrong-reasoning", explanation: "The correct reason is both simplify to 2:3, not because sums are equal." },
        { text: "No, one is bigger than the other", correct: false, misconceptionTag: "magnitude-confusion", explanation: "Equivalent ratios represent the same relationship regardless of actual numbers." }
      ]
    }
  ],

  /* ---- SCIENCE ---- */
  "photosynthesis": [
    {
      question: "Which gas do plants absorb during photosynthesis?",
      options: [
        { text: "Carbon dioxide (CO₂)", correct: true },
        { text: "Oxygen (O₂)", correct: false, misconceptionTag: "respiration-confusion", explanation: "Plants absorb O₂ during respiration, not photosynthesis. For photosynthesis, they absorb CO₂." },
        { text: "Nitrogen (N₂)", correct: false, misconceptionTag: "gas-confusion", explanation: "Nitrogen is the most abundant gas in air but isn't used in photosynthesis." },
        { text: "Hydrogen (H₂)", correct: false, misconceptionTag: "element-confusion", explanation: "Hydrogen comes from water (H₂O), not from the air. Plants absorb CO₂ from air." }
      ]
    },
    {
      question: "What is the green pigment in leaves called?",
      options: [
        { text: "Chlorophyll", correct: true },
        { text: "Chloroplast", correct: false, misconceptionTag: "organelle-pigment-confusion", explanation: "Chloroplast is the organelle (cell structure). Chlorophyll is the pigment inside it." },
        { text: "Chromatin", correct: false, misconceptionTag: "bio-term-confusion", explanation: "Chromatin is related to DNA in the nucleus. The green pigment is chlorophyll." },
        { text: "Cellulose", correct: false, misconceptionTag: "cell-component-confusion", explanation: "Cellulose is the cell wall material. Chlorophyll is the green photosynthetic pigment." }
      ]
    },
    {
      question: "What is the correct equation for photosynthesis?",
      options: [
        { text: "CO₂ + H₂O → Glucose + O₂ (with sunlight)", correct: true },
        { text: "O₂ + Glucose → CO₂ + H₂O", correct: false, misconceptionTag: "respiration-equation", explanation: "That's the equation for respiration, which is the reverse of photosynthesis." },
        { text: "CO₂ + O₂ → Glucose + H₂O", correct: false, misconceptionTag: "reactant-error", explanation: "Water (H₂O) is a reactant, not oxygen. Plants produce oxygen during photosynthesis." },
        { text: "Sunlight + O₂ → CO₂ + Glucose", correct: false, misconceptionTag: "process-reversal", explanation: "Sunlight is an energy source, not a chemical reactant. The inputs are CO₂ and H₂O." }
      ]
    },
    {
      question: "Where in the cell does photosynthesis occur?",
      options: [
        { text: "Chloroplast", correct: true },
        { text: "Mitochondria", correct: false, misconceptionTag: "organelle-confusion", explanation: "Mitochondria is where respiration happens. Photosynthesis happens in chloroplasts." },
        { text: "Nucleus", correct: false, misconceptionTag: "cell-function-confusion", explanation: "The nucleus controls cell activities and stores DNA. Photosynthesis occurs in chloroplasts." },
        { text: "Cell membrane", correct: false, misconceptionTag: "structure-confusion", explanation: "The cell membrane controls what enters/exits the cell. Chloroplasts contain the chlorophyll for photosynthesis." }
      ]
    },
    {
      question: "Which of these is NOT needed for photosynthesis?",
      options: [
        { text: "Oxygen", correct: true },
        { text: "Sunlight", correct: false, misconceptionTag: "essential-factor", explanation: "Sunlight IS needed — it's the energy source for photosynthesis." },
        { text: "Water", correct: false, misconceptionTag: "essential-factor", explanation: "Water IS needed — it's one of the two main reactants." },
        { text: "Carbon dioxide", correct: false, misconceptionTag: "essential-factor", explanation: "CO₂ IS needed — it's one of the two main reactants." }
      ]
    }
  ],

  "acids-bases": [
    {
      question: "What is the pH of a neutral solution?",
      options: [
        { text: "7", correct: true },
        { text: "0", correct: false, misconceptionTag: "scale-start-confusion", explanation: "pH 0 is the most acidic. Neutral is 7, which is in the middle of the 0-14 scale." },
        { text: "14", correct: false, misconceptionTag: "scale-end-confusion", explanation: "pH 14 is the most basic/alkaline. Neutral is pH 7." },
        { text: "1", correct: false, misconceptionTag: "number-confusion", explanation: "pH 1 is very strongly acidic. Pure water has pH 7, which is neutral." }
      ]
    },
    {
      question: "Which indicator turns pink in a basic solution?",
      options: [
        { text: "Phenolphthalein", correct: true },
        { text: "Litmus", correct: false, misconceptionTag: "indicator-confusion", explanation: "Litmus turns blue in a base, not pink. Phenolphthalein turns pink/magenta in bases." },
        { text: "Methyl orange", correct: false, misconceptionTag: "indicator-confusion", explanation: "Methyl orange turns yellow in bases. Phenolphthalein turns pink." },
        { text: "Turmeric", correct: false, misconceptionTag: "indicator-confusion", explanation: "Turmeric turns red/brown in bases. Phenolphthalein turns pink." }
      ]
    },
    {
      question: "What is formed when an acid reacts with a base?",
      options: [
        { text: "Salt and water", correct: true },
        { text: "Only salt", correct: false, misconceptionTag: "incomplete-products", explanation: "Neutralization always produces both a salt AND water. Acid + Base → Salt + Water." },
        { text: "Acid and gas", correct: false, misconceptionTag: "reaction-confusion", explanation: "Acid + Base gives Salt + Water (neutralization), not more acid." },
        { text: "A stronger acid", correct: false, misconceptionTag: "reaction-misconception", explanation: "Acids and bases neutralize each other, they don't make stronger acids." }
      ]
    },
    {
      question: "Which of these is a strong acid?",
      options: [
        { text: "Hydrochloric acid (HCl)", correct: true },
        { text: "Vinegar (Acetic acid)", correct: false, misconceptionTag: "strong-weak-confusion", explanation: "Vinegar is a weak acid. Strong acids like HCl dissociate completely in water." },
        { text: "Lemon juice (Citric acid)", correct: false, misconceptionTag: "strong-weak-confusion", explanation: "Citric acid is a weak acid. HCl, H₂SO₄, and HNO₃ are common strong acids." },
        { text: "Baking soda", correct: false, misconceptionTag: "acid-base-confusion", explanation: "Baking soda (NaHCO₃) is actually a mild base, not an acid." }
      ]
    },
    {
      question: "What happens to the pH when you add more acid to a solution?",
      options: [
        { text: "pH decreases", correct: true },
        { text: "pH increases", correct: false, misconceptionTag: "scale-direction-error", explanation: "Lower pH = more acidic. Adding acid makes the solution more acidic, so pH goes down." },
        { text: "pH stays the same", correct: false, misconceptionTag: "no-change-error", explanation: "Adding acid changes the pH — it makes the solution more acidic (lower pH)." },
        { text: "pH becomes exactly 0", correct: false, misconceptionTag: "extreme-assumption", explanation: "pH decreases but doesn't necessarily reach 0. It depends on how much acid is added." }
      ]
    }
  ],

  "refraction": [
    {
      question: "What happens when light passes from air into glass?",
      options: [
        { text: "It slows down and bends toward the normal", correct: true },
        { text: "It speeds up and bends away from the normal", correct: false, misconceptionTag: "speed-direction-reversed", explanation: "Light slows down in denser media (glass). Slower light bends toward the normal, not away." },
        { text: "It continues in a straight line", correct: false, misconceptionTag: "no-refraction", explanation: "Light bends (refracts) when it enters a medium of different density at an angle." },
        { text: "It stops completely", correct: false, misconceptionTag: "absorption-confusion", explanation: "Glass is transparent — light passes through it. It bends (refracts) but doesn't stop." }
      ]
    },
    {
      question: "What is the refractive index of a medium?",
      options: [
        { text: "Ratio of speed of light in vacuum to speed in the medium", correct: true },
        { text: "The angle at which light bends", correct: false, misconceptionTag: "definition-confusion", explanation: "Refractive index is a ratio of speeds, not an angle. The angle of bending depends on it." },
        { text: "The color of light that passes through", correct: false, misconceptionTag: "property-confusion", explanation: "Refractive index relates to speed of light, not color. Though it can cause dispersion." },
        { text: "The thickness of the medium", correct: false, misconceptionTag: "medium-property-confusion", explanation: "Thickness doesn't determine refractive index. It's about how much the medium slows light." }
      ]
    },
    {
      question: "A pencil appears bent in a glass of water due to:",
      options: [
        { text: "Refraction of light", correct: true },
        { text: "Reflection of light", correct: false, misconceptionTag: "reflection-refraction-confusion", explanation: "Reflection bounces light back. The bending effect is refraction — light changing speed between media." },
        { text: "Diffraction of light", correct: false, misconceptionTag: "phenomenon-confusion", explanation: "Diffraction is bending around obstacles. This is refraction — bending due to speed change." },
        { text: "Dispersion of light", correct: false, misconceptionTag: "phenomenon-confusion", explanation: "Dispersion splits light into colors. The bent pencil effect is due to refraction." }
      ]
    },
    {
      question: "What is total internal reflection?",
      options: [
        { text: "Complete reflection when light hits a boundary at an angle greater than the critical angle", correct: true },
        { text: "When all light is absorbed by the medium", correct: false, misconceptionTag: "absorption-confusion", explanation: "Total internal reflection means light bounces back entirely — none is absorbed or refracted." },
        { text: "When light travels in a straight line", correct: false, misconceptionTag: "concept-confusion", explanation: "Total internal reflection is about light bouncing back at steep angles, not straight-line travel." },
        { text: "Reflection from a mirror", correct: false, misconceptionTag: "regular-reflection-confusion", explanation: "Regular reflection from a mirror is different. TIR happens when light tries to leave a denser medium." }
      ]
    },
    {
      question: "Snell's Law relates:",
      options: [
        { text: "The angles of incidence and refraction to the refractive indices", correct: true },
        { text: "The speed of light to its color", correct: false, misconceptionTag: "law-confusion", explanation: "Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂). It relates angles and refractive indices." },
        { text: "The height of an image to object distance", correct: false, misconceptionTag: "formula-confusion", explanation: "That's related to magnification. Snell's Law is about refraction angles." },
        { text: "The intensity of light to distance", correct: false, misconceptionTag: "law-confusion", explanation: "That's the inverse-square law. Snell's Law is: n₁ sin(θ₁) = n₂ sin(θ₂)." }
      ]
    }
  ],

  /* ---- ENGLISH ---- */
  "active-passive": [
    {
      question: "Convert to passive: 'She writes a letter.'",
      options: [
        { text: "A letter is written by her.", correct: true },
        { text: "A letter was written by her.", correct: false, misconceptionTag: "tense-shift-error", explanation: "The original is in simple present tense. The passive should also be present: 'is written,' not 'was written.'" },
        { text: "She is written a letter.", correct: false, misconceptionTag: "subject-object-confusion", explanation: "In passive voice, the object becomes the subject. 'A letter' should come first." },
        { text: "A letter writes her.", correct: false, misconceptionTag: "structure-reversal", explanation: "Passive voice needs the form: Object + is/are + past participle + by + subject." }
      ]
    },
    {
      question: "Which sentence is in passive voice?",
      options: [
        { text: "The cake was eaten by the children.", correct: true },
        { text: "The children ate the cake.", correct: false, misconceptionTag: "active-passive-confusion", explanation: "This is active voice — subject (children) does the action. Passive has the object first." },
        { text: "The children are eating cake.", correct: false, misconceptionTag: "continuous-confusion", explanation: "This is active voice in present continuous. Passive would be: 'Cake is being eaten.'" },
        { text: "Eat the cake, children!", correct: false, misconceptionTag: "imperative-confusion", explanation: "This is an imperative sentence (command), not passive voice." }
      ]
    },
    {
      question: "Convert to passive: 'They are playing cricket.'",
      options: [
        { text: "Cricket is being played by them.", correct: true },
        { text: "Cricket is played by them.", correct: false, misconceptionTag: "continuous-dropped", explanation: "The original is present continuous. Use 'is being played,' not just 'is played.'" },
        { text: "Cricket was being played by them.", correct: false, misconceptionTag: "tense-error", explanation: "Keep the same tense. 'Are playing' (present continuous) → 'is being played.'" },
        { text: "They are being played cricket.", correct: false, misconceptionTag: "structure-error", explanation: "In passive voice, the object (cricket) becomes the subject of the sentence." }
      ]
    },
    {
      question: "Convert to active: 'The window was broken by Ravi.'",
      options: [
        { text: "Ravi broke the window.", correct: true },
        { text: "Ravi was breaking the window.", correct: false, misconceptionTag: "tense-change", explanation: "'Was broken' is simple past passive. Active is simple past: 'broke,' not 'was breaking.'" },
        { text: "The window broke Ravi.", correct: false, misconceptionTag: "subject-switch-error", explanation: "The doer (Ravi) becomes the subject. Ravi broke the window, not the other way." },
        { text: "Ravi breaks the window.", correct: false, misconceptionTag: "tense-error", explanation: "'Was broken' is past tense. The active form should also be past: 'Ravi broke.'" }
      ]
    },
    {
      question: "Which of these CANNOT be converted to passive voice?",
      options: [
        { text: "He laughed loudly.", correct: true },
        { text: "She painted a picture.", correct: false, misconceptionTag: "transitive-confusion", explanation: "'Painted a picture' has a direct object, so it CAN be converted to passive." },
        { text: "They built a house.", correct: false, misconceptionTag: "transitive-confusion", explanation: "'Built a house' has a direct object, so it CAN become passive." },
        { text: "The teacher taught a lesson.", correct: false, misconceptionTag: "transitive-confusion", explanation: "This has a direct object and CAN be made passive: 'A lesson was taught.'" }
      ]
    }
  ],

  "direct-indirect": [
    {
      question: "Convert to indirect: She said, 'I am happy.'",
      options: [
        { text: "She said that she was happy.", correct: true },
        { text: "She said that I am happy.", correct: false, misconceptionTag: "pronoun-unchanged", explanation: "In indirect speech, 'I' changes to 'she' (matching the subject). Tense also shifts." },
        { text: "She said that she is happy.", correct: false, misconceptionTag: "tense-unchanged", explanation: "When the reporting verb is past ('said'), 'am' changes to 'was.'" },
        { text: "She told that she was happy.", correct: false, misconceptionTag: "say-tell-confusion", explanation: "'Told' requires a person after it (told me/him/her). 'Said' works here without an object." }
      ]
    },
    {
      question: "Convert to indirect: He said, 'I will come tomorrow.'",
      options: [
        { text: "He said that he would come the next day.", correct: true },
        { text: "He said that he will come tomorrow.", correct: false, misconceptionTag: "no-backshift", explanation: "'Will' becomes 'would' and 'tomorrow' becomes 'the next day' in indirect speech." },
        { text: "He said that I would come tomorrow.", correct: false, misconceptionTag: "pronoun-error", explanation: "'I' changes to 'he' (matching the speaker). Also, 'tomorrow' → 'the next day.'" },
        { text: "He told he would come the next day.", correct: false, misconceptionTag: "told-without-object", explanation: "'Told' needs a person: 'He told me/us...' or use 'said' without an object." }
      ]
    },
    {
      question: "Which time expression changes in indirect speech? 'today' becomes:",
      options: [
        { text: "that day", correct: true },
        { text: "the day", correct: false, misconceptionTag: "approximation", explanation: "The standard change is 'today' → 'that day,' not just 'the day.'" },
        { text: "yesterday", correct: false, misconceptionTag: "time-shift-confusion", explanation: "'Today' becomes 'that day.' 'Yesterday' is the conversion of 'today' only if reporting the next day — the standard rule is 'that day.'" },
        { text: "It doesn't change", correct: false, misconceptionTag: "no-change-error", explanation: "Time expressions change in indirect speech: today→that day, now→then, here→there." }
      ]
    },
    {
      question: "Convert to indirect: 'Where do you live?' she asked.",
      options: [
        { text: "She asked where I lived.", correct: true },
        { text: "She asked where do I live.", correct: false, misconceptionTag: "question-word-order", explanation: "In indirect questions, use statement word order (subject + verb), not question order." },
        { text: "She asked that where I lived.", correct: false, misconceptionTag: "extra-that", explanation: "With wh-questions, don't use 'that.' Just: She asked where I lived." },
        { text: "She asked where I live.", correct: false, misconceptionTag: "tense-unchanged", explanation: "Since 'asked' is past, 'live' shifts to 'lived' (backshift rule)." }
      ]
    },
    {
      question: "Convert to indirect: 'Please close the door,' she said.",
      options: [
        { text: "She requested to close the door.", correct: true },
        { text: "She said please close the door.", correct: false, misconceptionTag: "no-conversion", explanation: "Indirect speech removes quotes and changes structure. 'Please' → use 'requested.'" },
        { text: "She said that close the door.", correct: false, misconceptionTag: "structure-error", explanation: "Requests use: requested/asked + to + verb. Not 'said that' + command." },
        { text: "She ordered that the door be closed.", correct: false, misconceptionTag: "tone-mismatch", explanation: "'Please' indicates a polite request. Use 'requested,' not 'ordered.'" }
      ]
    }
  ],

  /* ---- SOCIAL SCIENCE ---- */
  "modern-india": [
    {
      question: "Who is known as the 'Father of the Nation' in India?",
      options: [
        { text: "Mahatma Gandhi", correct: true },
        { text: "Jawaharlal Nehru", correct: false, misconceptionTag: "leader-confusion", explanation: "Nehru was the first Prime Minister. Mahatma Gandhi is called the Father of the Nation." },
        { text: "Subhas Chandra Bose", correct: false, misconceptionTag: "leader-confusion", explanation: "Bose led the INA. Gandhi is called the Father of the Nation for leading the freedom movement." },
        { text: "Dr. B.R. Ambedkar", correct: false, misconceptionTag: "leader-confusion", explanation: "Ambedkar is the Father of the Indian Constitution. Gandhi is called the Father of the Nation." }
      ]
    },
    {
      question: "When did India gain independence?",
      options: [
        { text: "15 August 1947", correct: true },
        { text: "26 January 1950", correct: false, misconceptionTag: "date-confusion", explanation: "26 January 1950 is Republic Day (when the Constitution came into effect). Independence Day is 15 August 1947." },
        { text: "15 August 1950", correct: false, misconceptionTag: "year-confusion", explanation: "The correct year is 1947, not 1950. 1950 is when India became a Republic." },
        { text: "26 January 1947", correct: false, misconceptionTag: "date-swap", explanation: "Independence was 15 August 1947. Republic Day (26 Jan) came in 1950." }
      ]
    },
    {
      question: "The Jallianwala Bagh massacre happened in which year?",
      options: [
        { text: "1919", correct: true },
        { text: "1942", correct: false, misconceptionTag: "event-date-confusion", explanation: "1942 was the Quit India Movement. Jallianwala Bagh massacre was in 1919." },
        { text: "1930", correct: false, misconceptionTag: "event-date-confusion", explanation: "1930 was the Salt March (Dandi March). Jallianwala Bagh was 13 April 1919." },
        { text: "1857", correct: false, misconceptionTag: "event-date-confusion", explanation: "1857 was the First War of Independence. Jallianwala Bagh was in 1919." }
      ]
    },
    {
      question: "What was the main demand of the Quit India Movement (1942)?",
      options: [
        { text: "End of British rule in India", correct: true },
        { text: "Separate electorate for Muslims", correct: false, misconceptionTag: "movement-confusion", explanation: "Separate electorate was a demand of the Muslim League. Quit India demanded complete British withdrawal." },
        { text: "Reduction of taxes", correct: false, misconceptionTag: "demand-confusion", explanation: "Tax issues were part of earlier movements. Quit India's slogan was 'Do or Die' for complete independence." },
        { text: "Women's right to vote", correct: false, misconceptionTag: "issue-confusion", explanation: "Quit India was about ending colonial rule, not specifically about voting rights." }
      ]
    },
    {
      question: "Who wrote the national anthem of India?",
      options: [
        { text: "Rabindranath Tagore", correct: true },
        { text: "Bankim Chandra Chattopadhyay", correct: false, misconceptionTag: "anthem-song-confusion", explanation: "Bankim Chandra wrote 'Vande Mataram' (National Song). Tagore wrote 'Jana Gana Mana' (National Anthem)." },
        { text: "Mahatma Gandhi", correct: false, misconceptionTag: "attribution-error", explanation: "Gandhi was a political leader. Rabindranath Tagore, a Nobel laureate poet, wrote the anthem." },
        { text: "Sarojini Naidu", correct: false, misconceptionTag: "attribution-error", explanation: "Sarojini Naidu was the 'Nightingale of India' (poet & freedom fighter). Tagore wrote the anthem." }
      ]
    }
  ],

  /* ---- HINDI ---- */
  "kriya": [
    {
      question: "क्रिया किसे कहते हैं?",
      options: [
        { text: "जो शब्द किसी काम का करना या होना बताए", correct: true },
        { text: "जो शब्द किसी व्यक्ति का नाम बताए", correct: false, misconceptionTag: "sangya-confusion", explanation: "नाम बताने वाले शब्द 'संज्ञा' हैं। क्रिया काम का करना या होना बताती है।" },
        { text: "जो शब्द किसी की विशेषता बताए", correct: false, misconceptionTag: "visheshan-confusion", explanation: "विशेषता बताने वाले शब्द 'विशेषण' हैं। क्रिया कार्य को दर्शाती है।" },
        { text: "जो शब्द संज्ञा के बदले आए", correct: false, misconceptionTag: "sarvanam-confusion", explanation: "संज्ञा के बदले आने वाले शब्द 'सर्वनाम' हैं।" }
      ]
    },
    {
      question: "'राम पुस्तक पढ़ता है।' — इसमें क्रिया कौन सा शब्द है?",
      options: [
        { text: "पढ़ता है", correct: true },
        { text: "राम", correct: false, misconceptionTag: "subject-as-verb", explanation: "'राम' कर्ता (subject) है, क्रिया नहीं। 'पढ़ता है' क्रिया है जो काम बता रही है।" },
        { text: "पुस्तक", correct: false, misconceptionTag: "object-as-verb", explanation: "'पुस्तक' कर्म (object) है। 'पढ़ता है' क्रिया है।" },
        { text: "है", correct: false, misconceptionTag: "partial-identification", explanation: "'पढ़ता है' पूरी क्रिया है। 'है' अकेला सहायक क्रिया है।" }
      ]
    },
    {
      question: "सकर्मक क्रिया का अर्थ है:",
      options: [
        { text: "जिस क्रिया का कर्म होता है", correct: true },
        { text: "जिस क्रिया का कर्म नहीं होता", correct: false, misconceptionTag: "sakarmak-akarmak-confusion", explanation: "कर्म न होना 'अकर्मक' क्रिया है। सकर्मक में कर्म होता है।" },
        { text: "जो क्रिया भविष्य में हो", correct: false, misconceptionTag: "tense-confusion", explanation: "यह काल (tense) का मामला है, सकर्मक-अकर्मक का नहीं।" },
        { text: "जो क्रिया दो बार हो", correct: false, misconceptionTag: "definition-error", explanation: "बार-बार होने का संबंध सकर्मक से नहीं है। सकर्मक = कर्म वाली क्रिया।" }
      ]
    },
    {
      question: "'वह रोज़ सुबह दौड़ता है।' — यह किस काल में है?",
      options: [
        { text: "सामान्य वर्तमान काल", correct: true },
        { text: "भूतकाल", correct: false, misconceptionTag: "tense-identification-error", explanation: "'दौड़ता है' — यह वर्तमान काल है क्योंकि 'है' लगा हुआ है।" },
        { text: "भविष्यकाल", correct: false, misconceptionTag: "tense-identification-error", explanation: "भविष्यकाल में 'गा/गी/गे' लगता है। यहाँ 'है' लगा है — वर्तमान काल।" },
        { text: "अपूर्ण वर्तमान काल", correct: false, misconceptionTag: "continuous-confusion", explanation: "अपूर्ण (continuous) में 'रहा है' लगता है। 'दौड़ता है' सामान्य वर्तमान है।" }
      ]
    },
    {
      question: "'बच्चे खेल रहे थे।' — इसमें कौन सी क्रिया है?",
      options: [
        { text: "खेल रहे थे (अपूर्ण भूतकाल)", correct: true },
        { text: "खेल (सामान्य भूतकाल)", correct: false, misconceptionTag: "partial-verb", explanation: "पूरी क्रिया 'खेल रहे थे' है — यह अपूर्ण (continuous) भूतकाल है।" },
        { text: "बच्चे (संज्ञा)", correct: false, misconceptionTag: "noun-as-verb", explanation: "'बच्चे' कर्ता (subject) है, क्रिया नहीं। 'खेल रहे थे' क्रिया है।" },
        { text: "थे (सहायक)", correct: false, misconceptionTag: "helper-only", explanation: "'थे' सहायक क्रिया है। पूरी क्रिया 'खेल रहे थे' है।" }
      ]
    }
  ],

  /* ---- PHYSICS ---- */
  "kinematics": [
    { question: "A car starts from rest and accelerates uniformly at 2 m/s². What is its velocity after 5 seconds?",
      options: [
        { text: "10 m/s", correct: true },
        { text: "25 m/s", correct: false, misconceptionTag: "formula-confusion", explanation: "Use v = u + at. v = 0 + 2×5 = 10 m/s. 25 would be s = ½at², which is displacement." },
        { text: "7 m/s", correct: false, misconceptionTag: "addition-error", explanation: "v = u + at = 0 + (2)(5) = 10 m/s, not 2+5." },
        { text: "2.5 m/s", correct: false, misconceptionTag: "division-error", explanation: "Don't divide — multiply a×t. v = 0 + 2×5 = 10 m/s." }
      ] },
    { question: "What does the area under a velocity-time graph represent?",
      options: [
        { text: "Displacement", correct: true },
        { text: "Acceleration", correct: false, misconceptionTag: "slope-area-confusion", explanation: "Acceleration is the slope of v-t graph. Area under the curve gives displacement." },
        { text: "Speed", correct: false, misconceptionTag: "concept-confusion", explanation: "Speed is the y-axis value. Area under v-t graph represents displacement." },
        { text: "Force", correct: false, misconceptionTag: "unrelated-concept", explanation: "Force is mass × acceleration. Area under v-t graph is displacement." }
      ] },
    { question: "A ball is thrown vertically upward. At the highest point, its acceleration is:",
      options: [
        { text: "9.8 m/s² downward", correct: true },
        { text: "Zero", correct: false, misconceptionTag: "velocity-acceleration-confusion", explanation: "Velocity is zero at the top, but gravity always acts: a = g = 9.8 m/s² downward." },
        { text: "9.8 m/s² upward", correct: false, misconceptionTag: "direction-error", explanation: "Gravity always acts downward, even at the highest point." },
        { text: "Depends on the mass", correct: false, misconceptionTag: "mass-gravity-confusion", explanation: "Acceleration due to gravity is independent of mass (Galileo's finding)." }
      ] },
    { question: "Displacement is different from distance because:",
      options: [
        { text: "Displacement has both magnitude and direction", correct: true },
        { text: "Distance is always zero", correct: false, misconceptionTag: "definition-error", explanation: "Distance is total path length (never zero if you moved). Displacement is shortest path with direction." },
        { text: "They are the same thing", correct: false, misconceptionTag: "scalar-vector-confusion", explanation: "Distance is scalar (no direction); displacement is vector (has direction)." },
        { text: "Displacement is always larger", correct: false, misconceptionTag: "magnitude-error", explanation: "Displacement ≤ distance always. It can be less if the path is curved." }
      ] },
    { question: "In projectile motion, the horizontal component of velocity:",
      options: [
        { text: "Remains constant throughout", correct: true },
        { text: "Increases with time", correct: false, misconceptionTag: "acceleration-confusion", explanation: "Only vertical velocity changes (due to gravity). Horizontal velocity stays constant (no horizontal force)." },
        { text: "Becomes zero at maximum height", correct: false, misconceptionTag: "vertical-horizontal-confusion", explanation: "Vertical velocity becomes zero at max height. Horizontal velocity remains unchanged." },
        { text: "Decreases due to gravity", correct: false, misconceptionTag: "gravity-direction", explanation: "Gravity acts vertically, not horizontally. Horizontal velocity is unaffected." }
      ] }
  ],

  "newtons-laws": [
    { question: "Newton's First Law is also known as the law of:",
      options: [
        { text: "Inertia", correct: true },
        { text: "Acceleration", correct: false, misconceptionTag: "law-numbering", explanation: "Second Law deals with acceleration (F=ma). First Law is about inertia — tendency to resist change." },
        { text: "Action-Reaction", correct: false, misconceptionTag: "law-numbering", explanation: "Third Law is action-reaction. First Law states objects resist changes in motion (inertia)." },
        { text: "Gravity", correct: false, misconceptionTag: "concept-confusion", explanation: "Law of gravity is separate. First Law is about inertia." }
      ] },
    { question: "A 5 kg object experiences a net force of 20 N. What is its acceleration?",
      options: [
        { text: "4 m/s²", correct: true },
        { text: "100 m/s²", correct: false, misconceptionTag: "multiplication-instead", explanation: "F = ma, so a = F/m = 20/5 = 4 m/s². Don't multiply." },
        { text: "25 m/s²", correct: false, misconceptionTag: "addition-error", explanation: "a = F/m = 20/5 = 4 m/s², not 20+5." },
        { text: "15 m/s²", correct: false, misconceptionTag: "subtraction-error", explanation: "a = F/m = 20/5 = 4 m/s², not 20-5." }
      ] },
    { question: "When you push a wall and it doesn't move, the reaction force is:",
      options: [
        { text: "The wall pushes back on you with equal force", correct: true },
        { text: "There is no reaction force", correct: false, misconceptionTag: "third-law-misunderstanding", explanation: "Newton's Third Law: every action has equal and opposite reaction. Wall pushes back." },
        { text: "Gravity pulling you down", correct: false, misconceptionTag: "force-pair-confusion", explanation: "Gravity and your push are different forces. The reaction to your push is the wall pushing back." },
        { text: "Friction on the floor", correct: false, misconceptionTag: "force-pair-confusion", explanation: "Friction is a separate force. The direct reaction to your push is the wall's push on you." }
      ] },
    { question: "Why does a passenger lean forward when a bus suddenly stops?",
      options: [
        { text: "Due to inertia of motion", correct: true },
        { text: "Due to gravity", correct: false, misconceptionTag: "force-confusion", explanation: "Gravity acts downward. The forward lean is due to inertia — body wants to continue moving." },
        { text: "Due to friction", correct: false, misconceptionTag: "force-confusion", explanation: "Friction stops the bus. The passenger leans forward because their body resists the change (inertia)." },
        { text: "Due to centripetal force", correct: false, misconceptionTag: "concept-confusion", explanation: "Centripetal force relates to circular motion. This is inertia of motion (Newton's First Law)." }
      ] },
    { question: "The unit of force in SI system is:",
      options: [
        { text: "Newton (N)", correct: true },
        { text: "Joule (J)", correct: false, misconceptionTag: "unit-confusion", explanation: "Joule is the unit of energy/work. Force is measured in Newtons (kg⋅m/s²)." },
        { text: "Watt (W)", correct: false, misconceptionTag: "unit-confusion", explanation: "Watt is the unit of power. Force is measured in Newtons." },
        { text: "Pascal (Pa)", correct: false, misconceptionTag: "unit-confusion", explanation: "Pascal is the unit of pressure. Force is measured in Newtons (N)." }
      ] }
  ],

  /* ---- CHEMISTRY ---- */
  "atomic-structure": [
    { question: "Who discovered the electron?",
      options: [
        { text: "J.J. Thomson", correct: true },
        { text: "Ernest Rutherford", correct: false, misconceptionTag: "scientist-confusion", explanation: "Rutherford discovered the nucleus. Thomson discovered electrons via cathode ray experiments." },
        { text: "Niels Bohr", correct: false, misconceptionTag: "scientist-confusion", explanation: "Bohr proposed the atomic model with orbits. Thomson discovered the electron." },
        { text: "James Chadwick", correct: false, misconceptionTag: "scientist-confusion", explanation: "Chadwick discovered the neutron. Thomson discovered the electron in 1897." }
      ] },
    { question: "The atomic number of an element represents:",
      options: [
        { text: "Number of protons", correct: true },
        { text: "Number of neutrons", correct: false, misconceptionTag: "proton-neutron-confusion", explanation: "Neutron count = Mass number − Atomic number. Atomic number = protons." },
        { text: "Total number of particles", correct: false, misconceptionTag: "mass-atomic-confusion", explanation: "Total nucleons is mass number. Atomic number is specifically the proton count." },
        { text: "Number of electron shells", correct: false, misconceptionTag: "shell-confusion", explanation: "Shell count depends on the period. Atomic number = number of protons." }
      ] },
    { question: "Which quantum number describes the shape of an orbital?",
      options: [
        { text: "Azimuthal (l)", correct: true },
        { text: "Principal (n)", correct: false, misconceptionTag: "quantum-number-confusion", explanation: "Principal (n) gives the energy level/shell. Azimuthal (l) determines shape (s, p, d, f)." },
        { text: "Magnetic (mₗ)", correct: false, misconceptionTag: "quantum-number-confusion", explanation: "Magnetic (mₗ) gives orientation. Azimuthal (l) gives shape." },
        { text: "Spin (mₛ)", correct: false, misconceptionTag: "quantum-number-confusion", explanation: "Spin (mₛ) is +½ or -½ for electron spin. Shape is determined by l." }
      ] },
    { question: "Maximum electrons in the 3rd shell (n=3) is:",
      options: [
        { text: "18", correct: true },
        { text: "8", correct: false, misconceptionTag: "octet-confusion", explanation: "2n² = 2(3²) = 18. The octet rule (8) is about valence stability, not max capacity." },
        { text: "32", correct: false, misconceptionTag: "wrong-shell", explanation: "32 is for n=4 (2×4²). For n=3, it's 2×3² = 18." },
        { text: "9", correct: false, misconceptionTag: "calculation-error", explanation: "Formula: 2n². So 2 × 9 = 18, not 9." }
      ] },
    { question: "Isotopes have the same number of:",
      options: [
        { text: "Protons but different neutrons", correct: true },
        { text: "Neutrons but different protons", correct: false, misconceptionTag: "isotope-isobar-confusion", explanation: "Same protons = same element = isotopes. Different protons would be different elements." },
        { text: "Electrons only", correct: false, misconceptionTag: "incomplete-understanding", explanation: "Neutral isotopes have same electrons AND protons. The key difference is neutron count." },
        { text: "Mass number", correct: false, misconceptionTag: "isobar-confusion", explanation: "Same mass number = isobars. Isotopes have same atomic number (protons), different mass." }
      ] }
  ],

  /* ---- COMPUTER SCIENCE ---- */
  "python-basics": [
    { question: "What is the output of: print(type(5.0))?",
      options: [
        { text: "<class 'float'>", correct: true },
        { text: "<class 'int'>", correct: false, misconceptionTag: "type-confusion", explanation: "5.0 has a decimal point, making it a float. 5 (without decimal) would be int." },
        { text: "<class 'str'>", correct: false, misconceptionTag: "type-confusion", explanation: "Strings are in quotes. 5.0 is a numeric type (float)." },
        { text: "Error", correct: false, misconceptionTag: "syntax-confusion", explanation: "This is valid Python. type() returns the data type of the argument." }
      ] },
    { question: "Which of these is a valid Python variable name?",
      options: [
        { text: "my_var", correct: true },
        { text: "2name", correct: false, misconceptionTag: "naming-rules", explanation: "Variable names cannot start with a number. my_var, _name, name2 are valid." },
        { text: "my-var", correct: false, misconceptionTag: "naming-rules", explanation: "Hyphens are not allowed in variable names. Use underscores: my_var." },
        { text: "class", correct: false, misconceptionTag: "reserved-word", explanation: "'class' is a Python keyword/reserved word and cannot be used as a variable name." }
      ] },
    { question: "What does len('Hello') return?",
      options: [
        { text: "5", correct: true },
        { text: "4", correct: false, misconceptionTag: "index-confusion", explanation: "len() counts all characters. 'Hello' has 5 characters (H-e-l-l-o). Index starts at 0, but length is 5." },
        { text: "6", correct: false, misconceptionTag: "counting-error", explanation: "Count carefully: H(1) e(2) l(3) l(4) o(5) = 5 characters." },
        { text: "Error", correct: false, misconceptionTag: "function-confusion", explanation: "len() is a built-in function that works on strings, lists, etc. Returns 5." }
      ] },
    { question: "What is the output of: print(10 // 3)?",
      options: [
        { text: "3", correct: true },
        { text: "3.33", correct: false, misconceptionTag: "division-confusion", explanation: "// is floor division (integer division). It returns 3, not 3.33. Use / for regular division." },
        { text: "1", correct: false, misconceptionTag: "modulo-confusion", explanation: "% gives remainder (10 % 3 = 1). // gives quotient: 10 // 3 = 3." },
        { text: "30", correct: false, misconceptionTag: "operator-confusion", explanation: "// is floor division, not multiplication. 10 // 3 = 3." }
      ] },
    { question: "Which loop is guaranteed to execute at least once in Python?",
      options: [
        { text: "Python doesn't have a do-while loop", correct: true },
        { text: "for loop", correct: false, misconceptionTag: "loop-confusion", explanation: "A for loop over an empty list won't execute. Python has no do-while loop natively." },
        { text: "while loop", correct: false, misconceptionTag: "loop-confusion", explanation: "while loop checks condition first — may not execute if condition is False initially." },
        { text: "do-while loop", correct: false, misconceptionTag: "language-confusion", explanation: "Python does NOT have a do-while loop. That's in C/Java. You can simulate it with while True + break." }
      ] }
  ],

  /* ---- BIOLOGY ---- */
  "cell-biology": [
    { question: "Which organelle is called the 'powerhouse of the cell'?",
      options: [
        { text: "Mitochondria", correct: true },
        { text: "Chloroplast", correct: false, misconceptionTag: "organelle-confusion", explanation: "Chloroplast is for photosynthesis (in plants). Mitochondria produces ATP energy." },
        { text: "Ribosome", correct: false, misconceptionTag: "organelle-confusion", explanation: "Ribosomes are for protein synthesis. Mitochondria produces energy (ATP)." },
        { text: "Nucleus", correct: false, misconceptionTag: "organelle-confusion", explanation: "Nucleus stores DNA and controls cell activities. Mitochondria is the powerhouse." }
      ] },
    { question: "Cell wall is found in:",
      options: [
        { text: "Plant cells only", correct: true },
        { text: "Both plant and animal cells", correct: false, misconceptionTag: "cell-type-confusion", explanation: "Animal cells have a cell membrane but NO cell wall. Plant cells have both." },
        { text: "Animal cells only", correct: false, misconceptionTag: "cell-type-confusion", explanation: "Animal cells lack a cell wall. It's a feature of plant cells (made of cellulose)." },
        { text: "Neither", correct: false, misconceptionTag: "structure-denial", explanation: "Plant cells definitely have cell walls made of cellulose for structural support." }
      ] },
    { question: "The process by which a cell divides into two identical cells is called:",
      options: [
        { text: "Mitosis", correct: true },
        { text: "Meiosis", correct: false, misconceptionTag: "division-confusion", explanation: "Meiosis produces 4 non-identical cells (for reproduction). Mitosis produces 2 identical cells." },
        { text: "Osmosis", correct: false, misconceptionTag: "process-confusion", explanation: "Osmosis is movement of water across a membrane. Cell division into 2 identical cells is mitosis." },
        { text: "Photosynthesis", correct: false, misconceptionTag: "process-confusion", explanation: "Photosynthesis makes food. Cell division is mitosis (2 identical) or meiosis (4 different)." }
      ] },
    { question: "Which organelle is responsible for protein synthesis?",
      options: [
        { text: "Ribosome", correct: true },
        { text: "Golgi apparatus", correct: false, misconceptionTag: "organelle-function", explanation: "Golgi modifies, sorts, and packages proteins. Ribosomes synthesize (make) proteins." },
        { text: "Lysosome", correct: false, misconceptionTag: "organelle-function", explanation: "Lysosomes digest waste. Ribosomes are the protein factories." },
        { text: "Vacuole", correct: false, misconceptionTag: "organelle-function", explanation: "Vacuoles store water and nutrients. Ribosomes make proteins from mRNA." }
      ] },
    { question: "DNA is found mainly in the:",
      options: [
        { text: "Nucleus", correct: true },
        { text: "Cytoplasm", correct: false, misconceptionTag: "location-confusion", explanation: "Most DNA is in the nucleus. Small amounts exist in mitochondria and chloroplasts." },
        { text: "Cell membrane", correct: false, misconceptionTag: "structure-confusion", explanation: "Cell membrane is a lipid bilayer. DNA is stored in the nucleus as chromosomes." },
        { text: "Ribosomes", correct: false, misconceptionTag: "location-confusion", explanation: "Ribosomes use RNA (from DNA) to make proteins. The DNA itself is in the nucleus." }
      ] }
  ],

  /* ---- ECONOMICS ---- */
  "micro-intro": [
    { question: "Economics is primarily concerned with:",
      options: [
        { text: "Allocation of scarce resources among unlimited wants", correct: true },
        { text: "Making money", correct: false, misconceptionTag: "common-misconception", explanation: "Economics studies resource allocation, not just money. It's about choices under scarcity." },
        { text: "Government budgets only", correct: false, misconceptionTag: "scope-confusion", explanation: "Government budgets are one topic. Economics covers all resource allocation decisions." },
        { text: "Stock markets", correct: false, misconceptionTag: "scope-confusion", explanation: "Stock markets are one small part. Economics is broadly about scarcity and choice." }
      ] },
    { question: "When the price of a good increases, the quantity demanded usually:",
      options: [
        { text: "Decreases", correct: true },
        { text: "Increases", correct: false, misconceptionTag: "inverse-relationship", explanation: "Law of demand: price ↑ → quantity demanded ↓ (inverse relationship)." },
        { text: "Stays the same", correct: false, misconceptionTag: "no-change-error", explanation: "Generally, higher prices reduce demand. This is the law of demand." },
        { text: "Becomes zero", correct: false, misconceptionTag: "extreme-assumption", explanation: "Demand decreases but rarely becomes zero unless the price is extremely high." }
      ] },
    { question: "An example of a microeconomic topic is:",
      options: [
        { text: "Pricing of a single product", correct: true },
        { text: "GDP of the country", correct: false, misconceptionTag: "micro-macro-confusion", explanation: "GDP is macroeconomics (whole economy). Microeconomics studies individual markets/firms." },
        { text: "National inflation rate", correct: false, misconceptionTag: "micro-macro-confusion", explanation: "Inflation is macro. Micro focuses on individual markets, firms, and consumers." },
        { text: "Government fiscal policy", correct: false, misconceptionTag: "micro-macro-confusion", explanation: "Fiscal policy is macroeconomics. Microeconomics studies individual economic units." }
      ] },
    { question: "The concept of 'opportunity cost' refers to:",
      options: [
        { text: "The value of the next best alternative foregone", correct: true },
        { text: "The price you pay for something", correct: false, misconceptionTag: "cost-confusion", explanation: "That's monetary cost. Opportunity cost is what you give up — the next best alternative." },
        { text: "The cost of production", correct: false, misconceptionTag: "cost-type-confusion", explanation: "Production cost is different. Opportunity cost is the value of the option you didn't choose." },
        { text: "Extra cost of producing one more unit", correct: false, misconceptionTag: "marginal-cost-confusion", explanation: "That's marginal cost. Opportunity cost is the value of the best forgone alternative." }
      ] },
    { question: "A demand curve slopes downward because:",
      options: [
        { text: "As price falls, consumers are willing to buy more", correct: true },
        { text: "As price rises, supply increases", correct: false, misconceptionTag: "demand-supply-confusion", explanation: "That describes supply, not demand. Demand curve: lower price → higher quantity demanded." },
        { text: "Income always increases with lower prices", correct: false, misconceptionTag: "income-effect-misunderstanding", explanation: "While real income effectively rises, the main reason is the substitution and income effects combined." },
        { text: "Producers lower prices to sell more", correct: false, misconceptionTag: "perspective-confusion", explanation: "The demand curve shows consumer behavior, not producer decisions." }
      ] }
  ]
};

/**
 * Get quiz questions for a concept.
 * Returns array of question objects, or null if not found.
 */
function getQuizForConcept(conceptId) {
  return QUIZZES[conceptId] || null;
}

/**
 * Get list of all concepts that have quizzes available.
 */
function getAvailableQuizConcepts() {
  return Object.keys(QUIZZES);
}
