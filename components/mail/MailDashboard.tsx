'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Archive, ArrowLeft, ChevronDown, Download, Inbox, Loader2, LogOut, Mail,
  Menu, MoreHorizontal, Paperclip, PenLine, RefreshCw, Reply, Search, Send,
  Star, X,
} from 'lucide-react'

const MAILBOXES = ['info@ufolabz.com', 'support@ufolabz.com', 'sales@ufolabz.com'] as const
type Mailbox = (typeof MAILBOXES)[number]
type Folder = 'inbox' | 'sent'

interface Attachment {
  id: string
  filename: string
  size: number
  content_type: string
  download_url?: string
}

interface Message {
  id: string
  to: string[]
  from: string
  created_at: string
  subject: string
  cc?: string[] | null
  reply_to?: string[] | null
  message_id?: string
  last_event?: string
  attachments?: Attachment[]
  html?: string | null
  text?: string | null
}

interface ComposeState {
  from: Mailbox
  to: string
  cc: string
  bcc: string
  subject: string
  text: string
  inReplyTo?: string
}

const emptyCompose = (from: Mailbox): ComposeState => ({ from, to: '', cc: '', bcc: '', subject: '', text: '' })

function parseAddresses(value: string) {
  return value.split(/[;,]/).map((item) => item.trim()).filter(Boolean)
}

function senderLabel(address: string) {
  const named = address.match(/^\s*([^<]+)\s*</)?.[1]?.replace(/^"|"$/g, '').trim()
  return named || address.replace(/<.*>/, '').split('@')[0]
}

function relativeDate(value: string) {
  const date = new Date(value)
  const now = new Date()
  if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function MailDashboard() {
  const [mailbox, setMailbox] = useState<Mailbox>(MAILBOXES[0])
  const [folder, setFolder] = useState<Folder>('inbox')
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [compose, setCompose] = useState<ComposeState | null>(null)
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [starred, setStarred] = useState<string[]>([])

  useEffect(() => {
    try { setStarred(JSON.parse(localStorage.getItem('ufo-mail-starred') || '[]')) } catch { /* ignore */ }
  }, [])

  const loadMessages = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/mail/messages?folder=${folder}&mailbox=${encodeURIComponent(mailbox)}`, { cache: 'no-store' })
      const body = await response.json()
      if (response.status === 401) return window.location.reload()
      if (!response.ok) throw new Error(body.error || 'Could not load messages')
      setMessages(body.data || [])
      setSelected(null)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load messages')
    } finally {
      setLoading(false)
    }
  }, [folder, mailbox])

  useEffect(() => { loadMessages() }, [loadMessages])

  const visibleMessages = useMemo(() => {
    const needle = query.toLowerCase().trim()
    if (!needle) return messages
    return messages.filter((message) => [message.from, message.subject, ...message.to].join(' ').toLowerCase().includes(needle))
  }, [messages, query])

  async function openMessage(message: Message) {
    setSelected(message)
    setDetailLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/mail/messages/${message.id}?folder=${folder}`, { cache: 'no-store' })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Could not load message')
      setSelected(body)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load message')
    } finally {
      setDetailLoading(false)
    }
  }

  function toggleStar(id: string) {
    setStarred((current) => {
      const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
      localStorage.setItem('ufo-mail-starred', JSON.stringify(next))
      return next
    })
  }

  function startReply() {
    if (!selected) return
    const replyAddress = selected.reply_to?.[0] || selected.from.match(/<([^>]+)>/)?.[1] || selected.from
    setCompose({
      from: mailbox,
      to: replyAddress,
      cc: '', bcc: '',
      subject: selected.subject.toLowerCase().startsWith('re:') ? selected.subject : `Re: ${selected.subject}`,
      text: '',
      inReplyTo: selected.message_id,
    })
  }

  async function sendMessage() {
    if (!compose) return
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...compose,
          to: parseAddresses(compose.to),
          cc: parseAddresses(compose.cc),
          bcc: parseAddresses(compose.bcc),
        }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Could not send email')
      setCompose(null)
      setNotice('Email sent successfully')
      window.setTimeout(() => setNotice(''), 3500)
      if (folder === 'sent') loadMessages()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not send email')
    } finally {
      setSending(false)
    }
  }

  async function logout() {
    await fetch('/api/mail/logout', { method: 'POST' })
    window.location.reload()
  }

  return (
    <main className="flex h-screen min-h-[600px] overflow-hidden bg-[#07100d] text-[#edf7f2]">
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-white/[0.07] bg-[#091510] p-4 transition-transform lg:static lg:translate-x-0`}>
        <div className="flex h-14 items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-alien-green text-[#06100c]"><Mail size={19} /></span>
            <div><p className="text-[10px] font-bold tracking-[.22em] text-alien-green">UFO LABZ</p><p className="font-semibold">Mail</p></div>
          </div>
          <button className="text-white/45 lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <button onClick={() => { setCompose(emptyCompose(mailbox)); setSidebarOpen(false) }} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-alien-green px-4 py-3 font-semibold text-[#06100c] hover:bg-[#43ffa6]">
          <PenLine size={17} /> Compose
        </button>

        <nav className="mt-6 space-y-1">
          <button onClick={() => { setFolder('inbox'); setSidebarOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${folder === 'inbox' ? 'bg-white/[.08] text-white' : 'text-white/55 hover:bg-white/[.04]'}`}><Inbox size={18} /> Inbox <span className="ml-auto text-xs text-white/35">{folder === 'inbox' ? messages.length : ''}</span></button>
          <button onClick={() => { setFolder('sent'); setSidebarOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${folder === 'sent' ? 'bg-white/[.08] text-white' : 'text-white/55 hover:bg-white/[.04]'}`}><Send size={18} /> Sent</button>
          <button disabled className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/25"><Archive size={18} /> Archive <span className="ml-auto text-[10px]">Soon</span></button>
        </nav>

        <div className="mt-7 border-t border-white/[.07] pt-5">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/30">Mailboxes</p>
          {MAILBOXES.map((address) => (
            <button key={address} onClick={() => { setMailbox(address); setSidebarOpen(false) }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${mailbox === address ? 'bg-alien-green/10 text-alien-green' : 'text-white/55 hover:bg-white/[.04]'}`}>
              <span className={`h-2 w-2 rounded-full ${mailbox === address ? 'bg-alien-green' : 'bg-white/20'}`} />
              <span className="truncate">{address}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto rounded-xl border border-white/[.06] bg-white/[.025] p-3">
          <p className="text-xs font-medium">Protected workspace</p>
          <p className="mt-1 text-[11px] leading-5 text-white/35">Messages are synced securely through Resend.</p>
          <button onClick={logout} className="mt-3 flex items-center gap-2 text-xs text-white/45 hover:text-white"><LogOut size={14} /> Sign out</button>
        </div>
      </aside>

      {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/60 lg:hidden" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-white/[.07] bg-[#091510]/90 px-4 sm:px-6">
          <button className="text-white/55 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search mail" className="w-full rounded-xl border border-white/[.07] bg-white/[.035] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-white/25 focus:border-alien-green/35" />
          </div>
          <button onClick={loadMessages} disabled={loading} className="grid h-10 w-10 place-items-center rounded-xl border border-white/[.07] text-white/45 hover:bg-white/[.04] hover:text-white" aria-label="Refresh"><RefreshCw className={loading ? 'animate-spin' : ''} size={17} /></button>
          <div className="hidden items-center gap-2 text-sm text-white/50 sm:flex"><span className="h-2 w-2 rounded-full bg-alien-green" /> Live</div>
        </header>

        <div className="flex min-h-0 flex-1">
          <section className={`${selected ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-r border-white/[.07] bg-[#08120e] md:w-[380px] xl:w-[430px]`}>
            <div className="flex items-center justify-between border-b border-white/[.06] px-5 py-4">
              <div><h1 className="text-lg font-semibold capitalize">{folder}</h1><p className="mt-0.5 text-xs text-white/35">{mailbox}</p></div>
              <ChevronDown size={16} className="text-white/30" />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading && <div className="grid h-48 place-items-center text-white/35"><Loader2 className="animate-spin" /></div>}
              {!loading && error && <div className="m-4 rounded-xl border border-red-300/15 bg-red-300/[.06] p-4 text-sm text-red-200">{error}</div>}
              {!loading && !error && visibleMessages.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center px-8 text-center"><Inbox size={30} className="mb-3 text-white/15" /><p className="font-medium text-white/60">No messages here</p><p className="mt-1 text-xs leading-5 text-white/30">New email for {mailbox} will appear automatically.</p></div>
              )}
              {!loading && visibleMessages.map((message) => (
                <button key={message.id} onClick={() => openMessage(message)} className={`group flex w-full gap-3 border-b border-white/[.05] px-4 py-4 text-left transition hover:bg-white/[.035] ${selected?.id === message.id ? 'bg-alien-green/[.07]' : ''}`}>
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-alien-green/25 to-nebula-500/20 text-sm font-semibold text-white/80">{senderLabel(folder === 'sent' ? message.to[0] || '?' : message.from).slice(0, 1).toUpperCase()}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2"><strong className="truncate text-sm font-medium">{folder === 'sent' ? `To: ${message.to.join(', ')}` : senderLabel(message.from)}</strong><time className="ml-auto shrink-0 text-[11px] text-white/30">{relativeDate(message.created_at)}</time></span>
                    <span className="mt-1 block truncate text-sm text-white/60">{message.subject || '(No subject)'}</span>
                    <span className="mt-1.5 flex items-center gap-2 text-[11px] text-white/25">{message.attachments?.length ? <Paperclip size={12} /> : null}{folder === 'sent' && message.last_event ? message.last_event : mailbox.split('@')[0]}</span>
                  </span>
                  <span onClick={(event) => { event.stopPropagation(); toggleStar(message.id) }} className="mt-8 text-white/20 hover:text-amber-300"> <Star size={15} fill={starred.includes(message.id) ? 'currentColor' : 'none'} className={starred.includes(message.id) ? 'text-amber-300' : ''} /></span>
                </button>
              ))}
            </div>
          </section>

          <section className={`${selected ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col bg-[#0a1511]`}>
            {!selected ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center"><Mail size={44} className="mb-4 text-white/10" /><h2 className="font-medium text-white/50">Select an email to read</h2><p className="mt-2 max-w-xs text-sm text-white/25">Your messages for {mailbox} are ready on the left.</p></div>
            ) : (
              <>
                <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/[.06] px-4 sm:px-6">
                  <button onClick={() => setSelected(null)} className="mr-1 text-white/50 hover:text-white md:hidden"><ArrowLeft size={21} /></button>
                  <button onClick={() => toggleStar(selected.id)} className={starred.includes(selected.id) ? 'text-amber-300' : 'text-white/30 hover:text-white'}><Star size={18} fill={starred.includes(selected.id) ? 'currentColor' : 'none'} /></button>
                  {folder === 'inbox' && <button onClick={startReply} className="ml-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/55 hover:bg-white/[.04] hover:text-white"><Reply size={17} /> <span className="hidden sm:inline">Reply</span></button>}
                  <MoreHorizontal className="ml-auto text-white/30" size={20} />
                </div>
                <article className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
                  {detailLoading ? <div className="grid h-48 place-items-center"><Loader2 className="animate-spin text-white/30" /></div> : (
                    <div className="mx-auto max-w-4xl">
                      <h2 className="text-xl font-semibold leading-8 sm:text-2xl">{selected.subject || '(No subject)'}</h2>
                      <div className="mt-6 flex items-start gap-3 border-b border-white/[.06] pb-6">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-alien-green/15 font-semibold text-alien-green">{senderLabel(selected.from).slice(0, 1).toUpperCase()}</span>
                        <div className="min-w-0"><p className="truncate text-sm font-medium">{selected.from}</p><p className="mt-1 text-xs text-white/35">to {selected.to.join(', ')}</p></div>
                        <time className="ml-auto shrink-0 text-xs text-white/30">{new Date(selected.created_at).toLocaleString()}</time>
                      </div>
                      <div className="mt-7 min-h-48 rounded-xl bg-white px-4 py-3 text-[#171717] sm:px-6">
                        {selected.html ? <iframe title="Email content" sandbox="" srcDoc={selected.html} className="min-h-[420px] w-full border-0 bg-white" /> : <pre className="whitespace-pre-wrap py-3 font-sans text-sm leading-7">{selected.text || 'This message has no readable body.'}</pre>}
                      </div>
                      {selected.attachments?.length ? (
                        <div className="mt-6"><p className="mb-3 flex items-center gap-2 text-sm font-medium"><Paperclip size={16} /> {selected.attachments.length} attachment{selected.attachments.length === 1 ? '' : 's'}</p><div className="flex flex-wrap gap-2">{selected.attachments.map((attachment) => <a key={attachment.id} href={attachment.download_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.035] px-4 py-3 text-sm hover:border-alien-green/25"><span className="max-w-[220px] truncate">{attachment.filename}</span><span className="text-xs text-white/30">{Math.max(1, Math.round(attachment.size / 1024))} KB</span><Download size={15} className="text-alien-green" /></a>)}</div></div>
                      ) : null}
                      {folder === 'inbox' && <button onClick={startReply} className="mt-7 flex items-center gap-2 rounded-xl border border-white/[.09] px-4 py-2.5 text-sm hover:bg-white/[.04]"><Reply size={16} /> Reply</button>}
                    </div>
                  )}
                </article>
              </>
            )}
          </section>
        </div>
      </section>

      {compose && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-6">
          <section className="flex h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl border border-white/[.09] bg-[#0c1914] shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-2xl">
            <header className="flex items-center border-b border-white/[.07] px-5 py-4"><h2 className="font-semibold">New message</h2><button onClick={() => setCompose(null)} className="ml-auto text-white/40 hover:text-white"><X size={20} /></button></header>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <label className="grid grid-cols-[55px_1fr] items-center border-b border-white/[.07] py-2 text-sm"><span className="text-white/35">From</span><select value={compose.from} onChange={(event) => setCompose({ ...compose, from: event.target.value as Mailbox })} className="bg-transparent py-2 outline-none">{MAILBOXES.map((address) => <option key={address} value={address} className="bg-[#0c1914]">{address}</option>)}</select></label>
              {(['to', 'cc', 'bcc'] as const).map((field) => <label key={field} className="grid grid-cols-[55px_1fr] items-center border-b border-white/[.07] py-2 text-sm"><span className="capitalize text-white/35">{field}</span><input value={compose[field]} onChange={(event) => setCompose({ ...compose, [field]: event.target.value })} placeholder={field === 'to' ? 'recipient@example.com' : 'Optional'} className="bg-transparent py-2 outline-none placeholder:text-white/20" /></label>)}
              <input value={compose.subject} onChange={(event) => setCompose({ ...compose, subject: event.target.value })} placeholder="Subject" className="w-full border-b border-white/[.07] bg-transparent py-4 text-base font-medium outline-none placeholder:text-white/20" />
              <textarea value={compose.text} onChange={(event) => setCompose({ ...compose, text: event.target.value })} placeholder="Write your message…" className="mt-4 min-h-[240px] w-full resize-y bg-transparent text-sm leading-7 outline-none placeholder:text-white/20" />
              {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
            </div>
            <footer className="flex items-center border-t border-white/[.07] p-4"><button onClick={sendMessage} disabled={sending || !compose.to || !compose.subject || !compose.text} className="flex items-center gap-2 rounded-xl bg-alien-green px-5 py-2.5 text-sm font-semibold text-[#06100c] disabled:opacity-40">{sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} {sending ? 'Sending…' : 'Send'}</button><span className="ml-3 text-xs text-white/25">Separate multiple recipients with commas</span></footer>
          </section>
        </div>
      )}

      {notice && <div className="fixed bottom-5 right-5 z-[60] rounded-xl bg-alien-green px-4 py-3 text-sm font-semibold text-[#06100c] shadow-xl">{notice}</div>}
    </main>
  )
}
