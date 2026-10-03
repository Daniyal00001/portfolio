import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaPaperPlane } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import AnimatedCard from './reactbits/AnimatedCard'
import AnimatedInput from './reactbits/AnimatedInput'
import AnimatedButton from './reactbits/AnimatedButton'
import SplitText from './reactbits/SplitText'
import { Mydata } from '../utils/MyCv'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Format email body with all form data
    const emailBody = `Hello ${Mydata.Name.split(' ')[0]},

My name is ${formData.name} and my email is ${formData.email}.

${formData.message}

Best regards,
${formData.name}`

    // Encode the subject and body for URL
    const encodedSubject = encodeURIComponent(formData.subject || 'Contact from Portfolio')
    const encodedBody = encodeURIComponent(emailBody)
    
    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(Mydata.Email)}&su=${encodedSubject}&body=${encodedBody}`
    
    // Open Gmail compose in new tab
    window.open(gmailUrl, '_blank')
    
    // Reset form after opening Gmail
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: Mydata.Email,
      link: `mailto:${Mydata.Email}`
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: Mydata.Phone.split(',')[0],
      link: `tel:${Mydata.Phone.split(',')[0].replace(/\s/g, '')}`
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      value: Mydata.Address,
      link: null
    }
  ]

  const socialLinks = [
    {
      icon: FaGithub,
      name: 'GitHub',
      url: 'https://github.com/faheem506pk',
      color: 'hover:text-gray-300'
    },
    {
      icon: FaLinkedin,
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/faheem506pk/',
      color: 'hover:text-blue-400'
    },
    {
      icon: FaTwitter,
      name: 'Instagram',
      url: 'https://instagram.com/faheem506pk_',
      color: 'hover:text-pink-400'
    }
  ]

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 relative" style={{ paddingTop: '120px' }}>
      <div className="container-max section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <RevealText direction="up" delay={0} className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <SplitText text="Get In Touch" className="gradient-text" delay={0.2} />
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
              Ready to start your next project? Let's discuss how we can work together to bring your ideas to life.
            </p>
          </RevealText>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Contact Information */}
            <RevealText direction="right" delay={0.2} className="space-y-4 sm:space-y-6">
              <AnimatedCard className="code-card rounded-2xl p-4 sm:p-6 md:p-8" hoverScale={true}>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Let's Connect</h3>
                <p className="text-slate-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a question, want to collaborate, or just want to say hi, 
                  I'd love to hear from you!
                </p>

                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {contactInfo.map((info, index) => (
                    <RevealText key={index} delay={0.3 + index * 0.1} direction="left">
                      <a
                        href={info.link || undefined}
                        className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                          info.link ? 'hover:bg-white/10 cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-slate-400 text-xs sm:text-sm">{info.title}</div>
                          <div className="text-white font-medium text-sm sm:text-base break-words">{info.value}</div>
                        </div>
                      </a>
                    </RevealText>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-6 sm:mt-8">
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Follow Me</h4>
                  <div className="flex space-x-3 sm:space-x-4">
                    {socialLinks.map((social, index) => (
                      <RevealText key={index} delay={0.5 + index * 0.1} direction="up">
                        <AnimatedCard
                          className={`w-10 h-10 sm:w-12 sm:h-12 glass-card rounded-xl flex items-center justify-center text-slate-400 transition-colors ${social.color}`}
                          hoverScale={true}
                        >
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex items-center justify-center"
                          >
                            <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                        </AnimatedCard>
                      </RevealText>
                    ))}
                  </div>
                </div>
              </AnimatedCard>

              {/* Availability Status */}
              <AnimatedCard className="glass-card rounded-2xl p-5 sm:p-6 md:p-8" hoverScale={true}>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                  <h4 className="text-base sm:text-lg font-semibold text-white">Currently Available</h4>
                </div>
                <p className="text-slate-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  I'm currently available for new projects and collaborations. 
                  Let's discuss your requirements and how I can help bring your vision to life.
                </p>
                <div className="text-xs sm:text-sm text-slate-400 space-y-1">
                  <div>Response time: Usually within 24 hours</div>
                  <div>Availability: Full-time</div>
                </div>
              </AnimatedCard>
            </RevealText>

            {/* Contact Form */}
            <RevealText direction="left" delay={0.3} className="code-card rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <AnimatedInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    label="Name"
                    placeholder="Your name"
                    required
                  />
                  <AnimatedInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    label="Email"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <AnimatedInput
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  label="Subject"
                  placeholder="What's this about?"
                  required
                />

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm sm:text-base"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <AnimatedButton
                  type="submit"
                  variant="primary"
                  className="w-full flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <FaPaperPlane className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Message</span>
                </AnimatedButton>

                <p className="text-xs text-slate-500 text-center mt-2 sm:mt-3">
                  Clicking "Send Message" will open Gmail with your message pre-filled
                </p>
              </form>
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
