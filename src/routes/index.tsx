/**
 * ============================================================
 *  PERSONAL PORTFOLIO — Single Page Application
 *  Dark tech aesthetic: black-navy + purple accents
 *  ============================================================
 *  QUICK CUSTOMIZATION GUIDE:
 *  - Search for "<!-- EDIT:" comments to find editable fields
 *  - Replace placeholder values with your real data
 *  - CV file: place your CV at /public/cv.pdf
 *  ============================================================
 */

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Route ────────────────────────────────────────────────────────────────────
export const Route = createFileRoute('/')({
  component: Portfolio,
})

// ─── Constants — Edit these with your real info ────────────────────────────────
const PERSONAL = {
  name: 'Ahad Matlaq',           // EDIT: Your full name
  title: 'Computer Science Graduate',  // EDIT: Your professional title
  city: 'Tabuk',                 // EDIT: Your city
  country: 'Saudi Arabia',              // EDIT: Your country
  email: 'ahad.matlaq@gmail.com',     // EDIT: Your email
  phone: '+966553914401',     // EDIT: Your phone
  linkedin: 'https://www.linkedin.com/in/ahad-matlaq-901b6530a', // EDIT: Your LinkedIn URL

  bio: `Computer Science graduate passionate about building modern and user-friendly applications.
I enjoy turning ideas into real projects using clean and efficient code, and I'm always eager to learn new technologies..`, // EDIT: Your bio
  cvFile: '/cv.pdf',  // EDIT: Path to your CV file in /public/
}

// ─── Starfield Canvas ──────────────────────────────────────────────────────────
function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate static stars
    type Star = { x: number; y: number; size: number; opacity: number; speed: number; phase: number }
    const stars: Star[] = Array.from({ length: 280 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.015 + 0.003,
      phase: Math.random() * Math.PI * 2,
    }))

    // Shooting stars
    type Shoot = { x: number; y: number; vx: number; vy: number; len: number; opacity: number; active: boolean }
    const shoots: Shoot[] = [1, 2, 3].map(() => ({ x: 0, y: 0, vx: 0, vy: 0, len: 0, opacity: 0, active: false }))

    let nextShoot = 2

    const spawnShoot = (s: Shoot) => {
      s.x = Math.random() * canvas.width * 0.7 + canvas.width * 0.1
      s.y = Math.random() * canvas.height * 0.25
      const angle = (Math.PI / 180) * (20 + Math.random() * 30)
      const spd = 9 + Math.random() * 7
      s.vx = Math.cos(angle) * spd
      s.vy = Math.sin(angle) * spd
      s.len = 80 + Math.random() * 60
      s.opacity = 0.9
      s.active = true
    }

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Twinkling stars
      stars.forEach(star => {
        const t = Math.sin(time * star.speed * 60 + star.phase) * 0.35 + 0.65
        const hue = 240 + Math.sin(star.phase) * 30
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 60%, 85%, ${star.opacity * t})`
        ctx.fill()
      })

      // Shooting stars
      if (time >= nextShoot) {
        const inactive = shoots.find(s => !s.active)
        if (inactive) {
          spawnShoot(inactive)
          nextShoot = time + 3 + Math.random() * 5
        }
      }

      shoots.forEach(s => {
        if (!s.active) return
        s.x += s.vx
        s.y += s.vy
        s.opacity -= 0.012
        if (s.opacity <= 0 || s.x > canvas.width || s.y > canvas.height) {
          s.active = false
          return
        }
        const tail = ctx.createLinearGradient(s.x - s.vx * (s.len / 10), s.y - s.vy * (s.len / 10), s.x, s.y)
        tail.addColorStop(0, 'rgba(167, 139, 250, 0)')
        tail.addColorStop(1, `rgba(196, 181, 253, ${s.opacity})`)
        ctx.beginPath()
        ctx.moveTo(s.x - s.vx * (s.len / 10), s.y - s.vy * (s.len / 10))
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = tail
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.stroke()
        // Glow tip
        ctx.beginPath()
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`
        ctx.fill()
      })

      animId = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

// ─── useInView Hook — triggers CSS animations on scroll ────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ─── Section Wrapper — fade-up animation on scroll ────────────────────────────
function Section({ id, className = '', children }: { id: string; className?: string; children: React.ReactNode }) {
  const { ref, inView } = useInView()
  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`portfolio-section ${inView ? 'in-view' : ''} ${className}`}
    >
      {children}
    </section>
  )
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-heading-wrapper">
      <h2 className="section-heading">{children}</h2>
      <div className="section-heading-line" />
    </div>
  )
}

// ─── Icon: Email ──────────────────────────────────────────────────────────────
function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

// ─── Icon: LinkedIn ───────────────────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

// ─── Icon: GitHub ─────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Training', href: '#training' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      // Find active section
      const sections = NAV_LINKS.map(l => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((href: string) => {
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }, [])

  return (
    <nav className={`portfolio-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        {/* Logo / Name */}
        <button className="nav-logo" onClick={() => scrollTo('#hero')}>
          <span className="nav-logo-bracket">&lt;</span>
          {/* EDIT: Replace with your initials or short name */}
          AM
          <span className="nav-logo-bracket">/&gt;</span>
        </button>

        {/* Desktop Links */}
        <ul className="nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <button
                className={`nav-link ${active === link.href.slice(1) ? 'active' : ''}`}
                onClick={() => scrollTo(link.href)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {NAV_LINKS.map(link => (
            <button key={link.href} className="nav-mobile-link" onClick={() => scrollTo(link.href)}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-inner">
        {/* Greeting tag */}
        <p className="hero-greeting animate-fade-down">
          <span className="hero-tag-sym">&lt;</span>
          Hello, World
          <span className="hero-tag-sym">/&gt;</span>
        </p>

        {/* Name */}
        <h1 className="hero-name animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {/* EDIT: Your name */}
          {PERSONAL.name}
        </h1>

        {/* Title */}
        <p className="hero-title animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {/* EDIT: Your professional title */}
          {PERSONAL.title}
        </p>

        {/* Location */}
        <p className="hero-location animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {/* EDIT: City, Country */}
          {PERSONAL.city}, {PERSONAL.country}
        </p>

        {/* Bio */}
        <p className="hero-bio animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {/* EDIT: Your short bio */}
          {PERSONAL.bio}
        </p>

        {/* Social Icons */}
        <div className="hero-socials animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <a href={`mailto:${PERSONAL.email}`} className="social-icon" title="Email" aria-label="Send email">
            <EmailIcon />
          </a>
          {/* EDIT: Update LinkedIn and GitHub URLs in PERSONAL constant above */}
          <a href={PERSONAL.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn" aria-label="LinkedIn profile">
            <LinkedInIcon />
          </a>
          <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub" aria-label="GitHub profile">
            <GitHubIcon />
          </a>
        </div>

        {/* Quick Nav Links */}
        <div className="hero-quick-nav animate-fade-up" style={{ animationDelay: '0.6s' }}>
          {['About', 'Experience', 'Projects', 'Contact'].map(label => (
            <button
              key={label}
              className="hero-quick-link"
              onClick={() => document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hero-ctas animate-fade-up" style={{ animationDelay: '0.7s' }}>
          {/* EDIT: Place your CV file at /public/cv.pdf */}
          <a href={PERSONAL.cvFile} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View CV
          </a>
          <a href={PERSONAL.cvFile} download className="btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CV
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-hint animate-fade-up" style={{ animationDelay: '1s' }}>
          <div className="scroll-dot" />
          <span>Scroll to explore</span>
        </div>
      </div>

      {/* Decorative grid */}
      <div className="hero-grid-overlay" aria-hidden="true" />
    </section>
  )
}

// ─── CV Section ───────────────────────────────────────────────────────────────
function CVSection() {
  return (
    <Section id="cv">
      <div className="container">
        <SectionHeading>Curriculum Vitae</SectionHeading>

        <div className="cv-card">
          <div className="cv-icon-area">
            {/* Document icon */}
            <svg viewBox="0 0 80 80" fill="none" width={80} height={80}>
              <rect x="12" y="4" width="46" height="60" rx="4" stroke="#7c3aed" strokeWidth="2" fill="rgba(124,58,237,0.08)" />
              <rect x="16" y="24" width="24" height="2" rx="1" fill="#a78bfa" />
              <rect x="16" y="30" width="36" height="2" rx="1" fill="#7c3aed" opacity="0.5" />
              <rect x="16" y="36" width="30" height="2" rx="1" fill="#7c3aed" opacity="0.4" />
              <rect x="16" y="42" width="34" height="2" rx="1" fill="#7c3aed" opacity="0.3" />
              <rect x="16" y="48" width="20" height="2" rx="1" fill="#7c3aed" opacity="0.25" />
              <rect x="28" y="8" width="20" height="12" rx="2" fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth="1.5" />
              <path d="M34 13h8M36 16h4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="cv-text">
            {/* EDIT: Update the description with your name and brief summary */}
            <h3 className="cv-name">{PERSONAL.name}</h3>
            <p className="cv-subtitle">{PERSONAL.title} · {PERSONAL.city}, {PERSONAL.country}</p>
            <p className="cv-desc">
              {/* EDIT: A one-line summary for the CV section */}
              Full resume available for download — includes complete work history, education, projects and skills.
            </p>
          </div>
          <div className="cv-actions">
            {/* EDIT: Both buttons link to PERSONAL.cvFile (/public/cv.pdf) */}
            <a href={PERSONAL.cvFile} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View CV
            </a>
            <a href={PERSONAL.cvFile} download className="btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <Section id="about">
      <div className="container">
        <SectionHeading>About Me</SectionHeading>

        <div className="about-grid">
          {/* Photo placeholder */}
          <div className="about-photo-wrap">
            <div className="about-photo-frame">
              {/* EDIT: Replace with your actual photo */}
              {/* Option 1: Use an <img> tag with your photo URL */}
              {/* Option 2: Leave the SVG avatar as a placeholder */}
              <div className="about-photo-inner">
                <svg viewBox="0 0 120 120" fill="none" width="100%" height="100%">
                  <circle cx="60" cy="60" r="60" fill="rgba(124,58,237,0.1)" />
                  <circle cx="60" cy="45" r="22" fill="rgba(124,58,237,0.3)" stroke="#7c3aed" strokeWidth="2" />
                  <ellipse cx="60" cy="105" rx="35" ry="25" fill="rgba(124,58,237,0.2)" stroke="#7c3aed" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <div className="about-photo-glow" />
          </div>

          {/* Bio content */}
          <div className="about-content">
            {/* EDIT: Replace with your personal story and background */}
            <p className="about-text">
              I'm a passionate software engineer with a love for building elegant solutions to complex problems.
              My journey into technology started with curiosity about how digital systems shape the modern world —
              that curiosity has driven me through years of learning, building, and shipping.
            </p>
            <p className="about-text">
              {/* EDIT: Second paragraph about your interests or approach */}
              When I'm not writing code, I explore new frameworks, contribute to open-source, and mentor aspiring
              developers. I believe great software is not just functional — it's intuitive, performant, and a
              pleasure to maintain.
            </p>

            {/* Quick stats */}
            <div className="about-stats">
              {/* EDIT: Update numbers to match your experience */}
              {[
                { value: '3+', label: 'Years Experience' },
                { value: '20+', label: 'Projects Built' },
                { value: '5+', label: 'Technologies' },
              ].map(stat => (
                <div key={stat.label} className="about-stat">
                  <span className="about-stat-value">{stat.value}</span>
                  <span className="about-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── Education Section ────────────────────────────────────────────────────────
function EducationSection() {
  // EDIT: Replace with your real education entries
  const education = [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: " University of Tabuk",
      period: "2021 – 2026",
      location: "Tabuk",
      description: `Studied core areas of computer science such as algorithms, data structures, software engineering, and database systems.

Worked on multiple academic projects involving web development and problem-solving using modern programming tools.`,
tags: ['Algorithms', 'Data Structures', 'Software Engineering', 'Web Development'],
      ],
    },
    // EDIT: Add or remove education entries as needed
    // {
    //   degree: "High School Diploma",
    //   institution: "Your High School",
    //   period: "2017 – 2020",
    //   location: "Cairo, Egypt",
    //   highlights: ["Top of class in Mathematics and Science"],
    // },
  ]

  return (
    <Section id="education">
      <div className="container">
        <SectionHeading>Education</SectionHeading>

        <div className="timeline">
          {education.map((edu, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-title">{edu.degree}</h3>
                    <p className="timeline-subtitle">{edu.institution}</p>
                  </div>
                  <div className="timeline-meta">
                    <span className="timeline-period">{edu.period}</span>
                    <span className="timeline-location">{edu.location}</span>
                    {edu.gpa && <span className="timeline-badge">GPA {edu.gpa}</span>}
                  </div>
                </div>
                <ul className="timeline-highlights">
                  {edu.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Training Section ─────────────────────────────────────────────────────────
function TrainingSection() {
  // EDIT: Replace with your actual courses and certifications
  const trainings = [
    {
      title: "Full-Stack Web Development Bootcamp",
      provider: "Udemy",
      date: "Jan 2023",
      credential: "UC-XXXXXXXX",  // EDIT: Your certificate ID
      skills: ["React", "Node.js", "MongoDB"],
    },
    {
      title: "AWS Cloud Practitioner Essentials",
      provider: "Amazon Web Services",
      date: "Mar 2023",
      credential: "AWS-XXXXXXXX",
      skills: ["Cloud", "EC2", "S3", "Lambda"],
    },
    {
      title: "Machine Learning Specialization",
      provider: "Coursera (DeepLearning.AI)",
      date: "Aug 2023",
      credential: "DL-XXXXXXXX",
      skills: ["Python", "TensorFlow", "Neural Networks"],
    },
    // EDIT: Add more training entries
  ]

  return (
    <Section id="training">
      <div className="container">
        <SectionHeading>Training & Certifications</SectionHeading>

        <div className="training-grid">
          {trainings.map((t, i) => (
            <div key={i} className="training-card">
              <div className="training-card-header">
                {/* Certificate icon */}
                <svg viewBox="0 0 32 32" fill="none" width={32} height={32}>
                  <circle cx="16" cy="14" r="9" stroke="#7c3aed" strokeWidth="1.5" fill="rgba(124,58,237,0.1)" />
                  <path d="M12 28l4-4 4 4V22a9 9 0 01-8 0v6z" fill="rgba(124,58,237,0.2)" stroke="#7c3aed" strokeWidth="1.5" />
                  <path d="M13 14l2 2 4-4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="training-date">{t.date}</span>
              </div>
              <h3 className="training-title">{t.title}</h3>
              <p className="training-provider">{t.provider}</p>
              {/* EDIT: Remove credential line if not applicable */}
              <p className="training-credential">ID: {t.credential}</p>
              <div className="training-skills">
                {t.skills.map(s => (
                  <span key={s} className="skill-tag small">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Work Experience Section ──────────────────────────────────────────────────
function ExperienceSection() {
  // EDIT: Replace with your actual work experience
  const jobs = [
    {
      title: "Junior Frontend Engineer",
      company: "TechNova Solutions",
      period: "Jun 2023 – Present",
      location: "Cairo, Egypt (Hybrid)",
      type: "Full-time",
      description: "Building high-performance React applications for enterprise clients across fintech and e-commerce domains.",
      responsibilities: [
        "Developed reusable component library reducing development time by 35%",
        "Optimized Core Web Vitals scores — LCP improved from 4.2s to 1.1s",
        "Collaborated with design team to implement Figma-to-code pixel-perfect UIs",
        "Mentored 2 junior developers in modern React patterns",
      ],
      stack: ["React", "TypeScript", "TanStack Query", "Tailwind CSS"],
    },
    {
      title: "Frontend Intern",
      company: "Innovatech Ltd.",
      period: "Feb 2023 – May 2023",
      location: "Cairo, Egypt (Remote)",
      type: "Internship",
      description: "Worked on the customer-facing dashboard for an IoT fleet management platform.",
      responsibilities: [
        "Implemented 12 dashboard widgets with real-time data visualization using Chart.js",
        "Fixed 40+ legacy bugs and improved test coverage from 48% to 71%",
        "Participated in daily stand-ups and bi-weekly sprint planning sessions",
      ],
      stack: ["Vue 3", "JavaScript", "Chart.js", "SCSS"],
    },
    // EDIT: Add more work experience entries
  ]

  return (
    <Section id="experience">
      <div className="container">
        <SectionHeading>Work Experience</SectionHeading>

        <div className="timeline">
          {jobs.map((job, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-title">{job.title}</h3>
                    <p className="timeline-subtitle">{job.company}</p>
                  </div>
                  <div className="timeline-meta">
                    <span className="timeline-period">{job.period}</span>
                    <span className="timeline-location">{job.location}</span>
                    <span className="timeline-badge">{job.type}</span>
                  </div>
                </div>
                <p className="timeline-desc">{job.description}</p>
                <ul className="timeline-highlights">
                  {job.responsibilities.map((r, j) => <li key={j}>{r}</li>)}
                </ul>
                <div className="timeline-stack">
                  {job.stack.map(s => <span key={s} className="skill-tag small">{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Skills Section ────────────────────────────────────────────────────────────
function SkillsSection() {
  // EDIT: Update categories and skills to match your actual skill set
  const skillCategories = [
    {
      category: "Frontend",
      icon: "⬡",
      skills: [
        { name: "React / Next.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "TanStack Router", level: 80 },
        { name: "Tailwind CSS", level: 88 },
        { name: "HTML / CSS", level: 95 },
      ],
    },
    {
      category: "Backend",
      icon: "⬡",
      skills: [
        { name: "Node.js", level: 78 },
        { name: "Express / Hono", level: 75 },
        { name: "REST APIs", level: 85 },
        { name: "PostgreSQL", level: 70 },
        { name: "MongoDB", level: 72 },
      ],
    },
    {
      category: "Tools & DevOps",
      icon: "⬡",
      skills: [
        { name: "Git / GitHub", level: 92 },
        { name: "Docker", level: 65 },
        { name: "Netlify / Vercel", level: 88 },
        { name: "AWS (basics)", level: 60 },
        { name: "Linux / CLI", level: 75 },
      ],
    },
  ]

  // EDIT: Additional technology badges
  const techBadges = [
    "Python", "Vite", "Vitest", "Playwright", "Redis",
    "GraphQL", "Figma", "Postman", "VS Code", "Jira",
  ]

  return (
    <Section id="skills">
      <div className="container">
        <SectionHeading>Skills</SectionHeading>

        <div className="skills-grid">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="skills-card">
              <h3 className="skills-category">{cat.category}</h3>
              <div className="skills-bars">
                {cat.skills.map(skill => (
                  <div key={skill.name} className="skill-bar-wrap">
                    <div className="skill-bar-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-pct">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div
                        className="skill-bar-fill"
                        style={{ '--skill-level': `${skill.level}%` } as React.CSSProperties}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional tech badges */}
        <div className="tech-badges">
          <p className="tech-badges-label">Also familiar with:</p>
          <div className="tech-badges-list">
            {techBadges.map(t => (
              <span key={t} className="skill-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── Projects Section ─────────────────────────────────────────────────────────
function ProjectsSection() {
  // EDIT: Replace with your actual projects
  const projects = [
    {
      title: "DevPortal Dashboard",
      description: "A real-time developer analytics dashboard with interactive charts, API key management, and usage monitoring.",
      stack: ["React", "TypeScript", "Chart.js", "Node.js", "PostgreSQL"],
      github: "https://github.com/yourusername/devportal",  // EDIT: Your GitHub link
      live: "https://devportal-demo.netlify.app",           // EDIT: Live demo URL
      featured: false,
      isGraduation: false,
    },
    {
      title: "TaskFlow — Project Manager",
      description: "Kanban-style project management app with drag-and-drop, real-time collaboration via WebSockets, and role-based access.",
      stack: ["Vue 3", "Pinia", "Socket.io", "Express", "MongoDB"],
      github: "https://github.com/yourusername/taskflow",
      live: null,
      featured: false,
      isGraduation: false,
    },
    // ── GRADUATION PROJECT PLACEHOLDER ──
    // EDIT: Fill in your graduation project details here
    {
      title: "Graduation Project",
      description: "Details coming soon. This placeholder is reserved for your graduation project.",
      stack: [],  // EDIT: Add technologies used
      github: null,
      live: null,
      featured: true,
      isGraduation: true,
    },
  ]

  return (
    <Section id="projects">
      <div className="container">
        <SectionHeading>Projects</SectionHeading>

        <div className="projects-grid">
          {projects.map((proj, i) => (
            <div
              key={i}
              className={`project-card ${proj.featured ? 'featured' : ''} ${proj.isGraduation ? 'graduation' : ''}`}
            >
              {proj.isGraduation && (
                <div className="graduation-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                  </svg>
                  Graduation Project
                </div>
              )}

              {proj.featured && !proj.isGraduation && (
                <div className="featured-badge">Featured</div>
              )}

              <h3 className="project-title">{proj.title}</h3>
              <p className="project-desc">{proj.description}</p>

              {proj.stack.length > 0 && (
                <div className="project-stack">
                  {proj.stack.map(s => <span key={s} className="skill-tag small">{s}</span>)}
                </div>
              )}

              <div className="project-links">
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noopener noreferrer" className="project-link">
                    <GitHubIcon />
                    Code
                  </a>
                )}
                {proj.live && (
                  <a href={proj.live} target="_blank" rel="noopener noreferrer" className="project-link accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live Demo
                  </a>
                )}
                {proj.isGraduation && !proj.github && !proj.live && (
                  <span className="project-link-placeholder">Details to be added</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

function ContactSection() {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch('/contact-form.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...fields }),
      })
      setStatus('success')
      setFields({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section id="contact">
      <div className="container">
        <SectionHeading>Contact Me</SectionHeading>

        <div className="contact-grid">
          {/* Contact info */}
          <div className="contact-info">
            <h3 className="contact-info-title">Let's Connect</h3>
            <p className="contact-info-desc">
              {/* EDIT: Your contact call-to-action message */}
              Open to new opportunities, collaborations, and interesting conversations.
              Feel free to reach out!
            </p>

            <div className="contact-items">
              {/* EDIT: Update with your real contact details */}
              <a href={`mailto:${PERSONAL.email}`} className="contact-item">
                <div className="contact-item-icon"><EmailIcon /></div>
                <div>
                  <p className="contact-item-label">Email</p>
                  <p className="contact-item-value">{PERSONAL.email}</p>
                </div>
              </a>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.46 9a20 20 0 01-3-8.59A2 2 0 012.45 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="contact-item-label">Phone</p>
                  {/* EDIT: Your phone number */}
                  <p className="contact-item-value">{PERSONAL.phone}</p>
                </div>
              </div>

              <a href={PERSONAL.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-item-icon"><LinkedInIcon /></div>
                <div>
                  <p className="contact-item-label">LinkedIn</p>
                  <p className="contact-item-value">linkedin.com/in/yourprofile</p>
                </div>
              </a>

              <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-item-icon"><GitHubIcon /></div>
                <div>
                  <p className="contact-item-label">GitHub</p>
                  {/* EDIT: Your GitHub username */}
                  <p className="contact-item-value">github.com/yourusername</p>
                </div>
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="contact-form-wrap">
            {status === 'success' ? (
              <div className="contact-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth={2} width={48} height={48}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you soon.</p>
                <button className="btn-outline" onClick={() => setStatus('idle')}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <input type="hidden" name="form-name" value="contact" />
                {/* Honeypot — leave hidden */}
                <input type="hidden" name="bot-field" />

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={fields.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={fields.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={fields.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={fields.message}
                    onChange={handleChange}
                    placeholder="Tell me more..."
                    rows={5}
                    required
                  />
                </div>

                {status === 'error' && (
                  <p className="form-error">Something went wrong. Please try again or email me directly.</p>
                )}

                <button type="submit" className="btn-primary full" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <span className="spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="footer-inner">
        {/* EDIT: Replace with your name */}
        <p className="footer-copy">© {new Date().getFullYear()} {PERSONAL.name}. All rights reserved.</p>
        <div className="footer-socials">
          <a href={`mailto:${PERSONAL.email}`} className="footer-icon" aria-label="Email"><EmailIcon /></a>
          <a href={PERSONAL.linkedin} target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="LinkedIn"><LinkedInIcon /></a>
          <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="GitHub"><GitHubIcon /></a>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Portfolio Component ─────────────────────────────────────────────────
function Portfolio() {
  return (
    <div className="portfolio-root">
      {/* Animated starfield fixed background */}
      <StarfieldCanvas />

      {/* Fixed navigation */}
      <Navbar />

      {/* Main content */}
      <main className="portfolio-main">
        <HeroSection />
        <CVSection />
        <AboutSection />
        <EducationSection />
        <TrainingSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}
