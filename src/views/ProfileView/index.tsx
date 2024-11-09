"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  ChevronRight,
  Pencil,
  Link as LinkIcon,
  Award,
  Zap,
  Briefcase,
  Book,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Input } from "@/components/ui/input";

const interviewProgressData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 59 },
  { month: "Mar", score: 80 },
  { month: "Apr", score: 81 },
  { month: "May", score: 76 },
  { month: "Jun", score: 85 },
];

const skillsData = [
  { subject: "JavaScript", A: 120, fullMark: 150 },
  { subject: "React", A: 98, fullMark: 150 },
  { subject: "Node.js", A: 86, fullMark: 150 },
  { subject: "System Design", A: 99, fullMark: 150 },
  { subject: "Data Structures", A: 85, fullMark: 150 },
  { subject: "Algorithms", A: 65, fullMark: 150 },
];

export default function ProfilePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [skills, setSkills] = useState(["JavaScript", "React", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");
  const [profileLinks, setProfileLinks] = useState([
    { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
    { platform: "GitHub", url: "https://github.com/johndoe" },
  ]);
  const [newLinkPlatform, setNewLinkPlatform] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLinkPlatform.trim() !== "" && newLinkUrl.trim() !== "") {
      setProfileLinks([
        ...profileLinks,
        { platform: newLinkPlatform.trim(), url: newLinkUrl.trim() },
      ]);
      setNewLinkPlatform("");
      setNewLinkUrl("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 flex">
          <div className="flex-1">
            <CardHeader>
              <CardTitle>About </CardTitle>

              <div className="flex items-center pt-8  space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src="/placeholder.svg?height=80&width=80"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  {isEditingName ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      className="font-bold text-xl"
                    />
                  ) : (
                    <CardTitle className="flex items-center">
                      {name}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingName(true)}
                        className="ml-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  )}
                  <CardDescription>Software Engineer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">
                    Email
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingEmail(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                {isEditingEmail ? (
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setIsEditingEmail(false)}
                  />
                ) : (
                  <div>{email}</div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Member Since
                </div>
                <div>January 2023</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Interviews Completed
                </div>
                <div>27</div>
              </div>
            </CardContent>
          </div>

          <div className="flex-1 pt-16">
            {/* <CardHeader>
              <CardTitle>Skills & Profile Links</CardTitle>
            </CardHeader> */}
            <CardContent className="space-y-6">
              {/* <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Skills
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleAddSkill}
                />
              </div> */}
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Profile Links
                </div>
                <ul className="space-y-2 mb-2">
                  {profileLinks.map((link, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link.platform}
                      </a>
                    </li>
                  ))}
                </ul>
                <form onSubmit={handleAddLink} className="space-y-2">
                  <Input
                    placeholder="Platform (e.g., Twitter)"
                    value={newLinkPlatform}
                    onChange={(e) => setNewLinkPlatform(e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Add Link
                  </Button>
                </form>
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Award className="mr-1 h-3 w-3" /> Interview Pro
              </Badge>
              <Badge variant="secondary">
                <Zap className="mr-1 h-3 w-3" /> Quick Learner
              </Badge>
              <Badge variant="secondary">
                <Briefcase className="mr-1 h-3 w-3" /> Job Ready
              </Badge>
              <Badge variant="secondary">
                <Book className="mr-1 h-3 w-3" /> Knowledge Master
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-4">
              <h4 className="font-medium">Next Interview</h4>
              <p className="text-sm text-muted-foreground">
                Backend Developer - June 15, 2023
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Interview Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={interviewProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Mock Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {["Frontend Developer", "System Design", "Data Structures"].map(
                (interview, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{interview}</div>
                      <div className="text-sm text-muted-foreground">
                        Completed on {new Date().toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Report <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="#"
                className="flex items-center p-3 rounded-lg hover:bg-accent"
              >
                <div className="flex-1">
                  <h3 className="font-medium">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your email and push notifications
                  </p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex items-center p-3 rounded-lg hover:bg-accent"
              >
                <div className="flex-1">
                  <h3 className="font-medium">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Control your profile visibility and data usage
                  </p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex items-center p-3 rounded-lg hover:bg-accent"
              >
                <div className="flex-1">
                  <h3 className="font-medium">Subscription Management</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage your current plan
                  </p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex items-center p-3 rounded-lg hover:bg-accent"
              >
                <div className="flex-1">
                  <h3 className="font-medium">Account Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Update password and security settings
                  </p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
