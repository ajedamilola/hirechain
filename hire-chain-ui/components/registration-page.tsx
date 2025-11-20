import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import Link from "next/link";

interface RegistrationPageProps {
  accountId: string;
  onRegister: (data: RegistrationData) => void;
  processing: boolean;
}

interface RegistrationData {
  accountId: string;
  name: string;
  email: string;
  profileType: "freelancer" | "hirer" | "";
  skills: string[];
  portfolioUrl: string;
}

const TECH_SKILLS = [
  // Web3 & Blockchain
  "Solidity",
  "Web3.js",
  "Ethers.js",
  "Smart Contracts",
  "Ethereum",
  "Solana",
  "Polygon",
  "NFT Development",
  "DeFi",
  "Blockchain",
  "MetaMask Integration",
  "Hardhat",
  "Truffle",
  "Rust (Blockchain)",
  "Hedera",
  "Hashgraph",

  // Frontend Development
  "React",
  "Vue.js",
  "Angular",
  "Next.js",
  "Svelte",
  "JavaScript",
  "TypeScript",
  "Tailwind CSS",
  "Vite",

  // Backend Development
  "Node.js",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "PHP",
  "Django",
  "Flask",
  "Spring",
  "FastAPI",

  // Databases & APIs
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Firebase",
  "GraphQL",
  "REST API",

  // DevOps & Cloud
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "GitHub Actions",

  // Design & UX
  "UI/UX Design",
  "Figma",
  "Adobe XD",
  "Wireframing",
  "Prototyping",

  // Data & AI
  "Machine Learning",
  "Data Science",
  "Artificial Intelligence",
  "TensorFlow",
  "PyTorch",

  // General Tech Skills
  "Git & GitHub",
  "Technical Writing",
  "Project Management",
  "API Testing",
  "Database Design",
  "System Architecture",
  "Security & Cybersecurity",
  "Quality Assurance",
  "DevOps",
  "Agile Development"
];

export function RegistrationPage({
  accountId,
  onRegister,
  processing
}: RegistrationPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileType, setProfileType] = useState<"freelancer" | "hirer" | "">(
    ""
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");

  const filteredSkills = TECH_SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !skills.includes(skill)
  );

  const handleAddSkill = (skill: string) => {
    if (skills.length < 15 && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleCustomSkillAdd = () => {
    if (
      skillInput.trim() &&
      skills.length < 15 &&
      !skills.includes(skillInput.trim())
    ) {
      handleAddSkill(skillInput.trim());
    }
  };

  const handleRegister = () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!profileType) {
      setError("Please select your profile type");
      return;
    }

    if (skills.length === 0 && profileType == "freelancer") {
      setError("Please add at least one skill");
      return;
    }

    const registrationData: RegistrationData = {
      accountId,
      name: name.trim(),
      email: email.trim(),
      profileType,
      skills,
      portfolioUrl: portfolioUrl.trim()
    };

    onRegister(registrationData);
  };

  const isFormValid =
    name.trim() && email.trim() && profileType && (skills.length > 0 || profileType == "hirer");

  return accountId ? (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-[#f5f1fa] to-[#faf8fd] px-4'>
      <div className='w-full max-w-2xl space-y-8'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-4xl font-bold text-[#2b0a30]'>HireChain</h1>
          <p className='text-[#2b0a30]/70'>
            Complete your profile to get started
          </p>
        </div>

        {/* Form Container */}
        <div className='bg-white rounded-2xl shadow-lg p-8 space-y-6'>
          {/* Error Message */}
          {error && (
            <div className='p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3'>
              <AlertCircle className='h-5 w-5 text-red-500 shrink mt-0.5' />
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className='text-sm font-semibold text-[#2b0a30] block mb-2'>
              Full Name *
            </label>
            <input
              type='text'
              placeholder='Alice Freelancer'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-white text-[#2b0a30] placeholder:text-[#2b0a30]/50 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all'
            />
          </div>

          {/* Email Field */}
          <div>
            <label className='text-sm font-semibold text-[#2b0a30] block mb-2'>
              Email Address *
            </label>
            <input
              type='email'
              placeholder='alice@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-white text-[#2b0a30] placeholder:text-[#2b0a30]/50 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all'
            />
          </div>

          {/* Profile Type Selection */}
          <div>
            <label className='text-sm font-semibold text-[#2b0a30] block mb-3'>
              Profile Type *
            </label>
            <div className='grid grid-cols-2 gap-4'>
              <button
                onClick={() => setProfileType("freelancer")}
                className={`p-4 rounded-lg border-2 transition-all font-medium ${profileType === "freelancer"
                  ? "border-indigo-600 bg-indigo-600/5 text-indigo-600"
                  : "border-[#2b0a30]/20 bg-white text-[#2b0a30] hover:border-indigo-600/50"
                  }`}
              >
                Freelancer
              </button>
              <button
                onClick={() => setProfileType("hirer")}
                className={`p-4 rounded-lg border-2 transition-all font-medium ${profileType === "hirer"
                  ? "border-indigo-600 bg-indigo-600/5 text-indigo-600"
                  : "border-[#2b0a30]/20 bg-white text-[#2b0a30] hover:border-indigo-600/50"
                  }`}
              >
                Hirer
              </button>
            </div>
          </div>

          {/* Skills Field */}
          <div>
            <label className='text-sm font-semibold text-[#2b0a30] block mb-2'>
              Technical Skills {profileType == "hirer" ? "(Optional)" : "*"}
              <span className='text-xs text-[#2b0a30]/60'>
                ({skills.length}/15)
              </span>
            </label>

            {/* Skill Input */}
            <div className='relative mb-3'>
              <input
                type='text'
                placeholder='Search or add a skill...'
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCustomSkillAdd();
                  }
                }}
                disabled={skills.length >= 15}
                className='w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-white text-[#2b0a30] placeholder:text-[#2b0a30]/50 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && skillInput && filteredSkills.length > 0 && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-indigo-600/30 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto'>
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      className='w-full text-left px-4 py-2 hover:bg-indigo-600/5 text-[#2b0a30] text-sm transition-colors'
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Skills */}
            <div className='flex flex-wrap gap-2'>
              {skills.map((skill) => (
                <div
                  key={skill}
                  className='inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 border border-indigo-600/30 text-indigo-600 rounded-full text-sm font-medium'
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className='hover:text-indigo-600/70 transition-colors'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio URL Field */}
          <div>
            <label className='text-sm font-semibold text-[#2b0a30] block mb-2'>
              Portfolio URL (Optional)
            </label>
            <input
              type='url'
              placeholder='https://alice.dev'
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-white text-[#2b0a30] placeholder:text-[#2b0a30]/50 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all'
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRegister}
            disabled={!isFormValid || processing}
            className='w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
          >
            {processing ? "Creating Profile..." : "Complete Registration"}
          </button>
        </div>

        {/* Footer */}
        <p className='text-xs text-[#2b0a30]/70 text-center'>
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  ) : (
    <div></div>
  );
}
