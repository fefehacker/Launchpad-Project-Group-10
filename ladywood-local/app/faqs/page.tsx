'use client'

import { useMemo, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import SearchBar from '../../components/SearchBar'
import styles from './faqs.module.css'

const FAQS = [
    {
        question: 'What is Ladywood Local?',
        answer:
            'Ladywood Local is a community map for Birmingham that highlights food banks, community fridges, warm hubs and local waste centres. It is designed to help residents and volunteers find support nearby.',
    },
    {
        question: 'How do I use the map?',
        answer:
            'Use the sidebar filters to choose the categories you want to see, and type a place or street name in the search field. The map will update automatically with matching locations.',
    },
    {
        question: 'What do the categories mean?',
        answer:
            'The map uses four categories: food banks, community fridges, warm hubs, and waste centres. Each category is colour-coded and represents a specific type of local community resource.',
    },
    {
        question: 'Can I suggest a new resource?',
        answer:
            'Yes. If you know of a local service that should be included, use the sign-up page to get in touch and we can add it to the database after verification.',
    },
    {
        question: 'Is the data kept up to date?',
        answer:
            'We try to keep the listings current, but some opening hours and referral requirements can change. If you spot an error, please tell us so we can fix it.',
    },
]

const FOODBANK_FAQS = [
    {
        question: 'How do I get a voucher for a food bank?',
        answer:
            'Most food banks require a referral voucher from a local agency. If you need a voucher, contact your local support agency or the city council.',
    },
    {
        question: 'What would the food parcel contain?',
        answer: 'The food parcel will typically contain 3 days worth of food, for you and your household/family unit.',
    },
    {
        question: 'How long are the visits?',
        answer:
            'Visits usually take 30-60 minutes, depending on busyness, and the type of support needed.',
    },
    {
        question: 'Are deliveries available?',
        answer:
            'Unfortunately, deliveries are not currently available for any of the listed services.',
    }
]
const RECYCLE_FAQS = [
    {
        question: 'What can I take to the waste centre?',
        answer: 'You can take household waste, recyclables, and bulky items to the waste centre.'
    },
    {
        question: 'Can I bring my waste in a van or trailer?',
        answer: 'Yes, small trailers (up to 6x4) are accepted, but you may need to book an appointment in advance for anything larger.'
    },
    {
        question: 'What will happen when I arrive at the waste centre?',
        answer: 'When you arrive, you will be directed to the appropriate area for your waste type. Each site has its own guidelines, however staff are available to assist if needed.'
    },
]

const CONTACTS = [
    {
        label: 'Universal credit support',
        detail: '0800 328 5644',
    },
    {
        label: 'Housing and Homelessness support',
        detail: '0121 303 7410',
    },
    {
        label: 'Out of hours housing emergencies',
        detail: '0121 303 2296',
    },
    {
        label: 'NHS non-emergency advice',
        detail: '111',
    },
    {
        label: 'Womens Aid Birmingham (domestic abuse support)',
        detail: '0808 800 0028',
    }
]

export default function FaqsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const normalizedQuery = searchQuery.trim().toLowerCase()

    const filteredFAQ = useMemo(
        () =>
            FAQS.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(normalizedQuery) ||
                    faq.answer.toLowerCase().includes(normalizedQuery)
            ),
        [normalizedQuery]
    )

    const filteredFoodbankFaq = useMemo(
        () =>
            FOODBANK_FAQS.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(normalizedQuery) ||
                    faq.answer.toLowerCase().includes(normalizedQuery)
            ),
        [normalizedQuery]
    )

    const filteredRecycleFaq = useMemo(
        () =>
            RECYCLE_FAQS.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(normalizedQuery) ||
                    faq.answer.toLowerCase().includes(normalizedQuery)
            ),
        [normalizedQuery]
    )

    const hasResults =
        filteredFAQ.length + filteredFoodbankFaq.length + filteredRecycleFaq.length > 0

    return (
        <>
            <AppHeader />
            <main id="main-content">
                <div className={styles.pageBody}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h1>Frequently asked questions</h1>
                            <p>Find answers about the map, the categories, and how to get involved in Ladywood.</p>
                        </div>

                        <div className={styles.searchBarWrapper}>
                            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search FAQs…" />
                        </div>

                        {!hasResults ? (
                            <p className={styles.noResults}>No matching FAQs were found.</p>
                        ) : null}

                        {filteredFAQ.length > 0 ? (
                            <section className={styles.faqList}>
                                {filteredFAQ.map((faq) => (
                                    <article key={faq.question} className={styles.faqItem}>
                                        <h2>{faq.question}</h2>
                                        <p>{faq.answer}</p>
                                    </article>
                                ))}
                            </section>
                        ) : null}

                        <div className={styles.cardHeader}>
                            <h1>Ladywood Food Bank FAQs</h1>
                            <p>Find answers on food bank services and procedures.</p>
                        </div>

                        {filteredFoodbankFaq.length > 0 ? (
                            <section className={styles.faqList}>
                                {filteredFoodbankFaq.map((faq) => (
                                    <article key={faq.question} className={styles.faqItem}>
                                        <h2>{faq.question}</h2>
                                        <p>{faq.answer}</p>
                                    </article>
                                ))}
                            </section>
                        ) : null}

                        <div className={styles.cardHeader}>
                            <h1>Ladywood Recycle Centre FAQs</h1>
                            <p>Find answers on recycling services and procedures.</p>
                        </div>

                        {filteredRecycleFaq.length > 0 ? (
                            <section className={styles.faqList}>
                                {filteredRecycleFaq.map((faq) => (
                                    <article key={faq.question} className={styles.faqItem}>
                                        <h2>{faq.question}</h2>
                                        <p>{faq.answer}</p>
                                    </article>
                                ))}
                            </section>
                        ) : null}

                        <div className={styles.cardHeader}>
                            <h1>Useful numbers and emails</h1>
                            <p>Contact details for Ladywood Local services, referrals and support.</p>
                        </div>

                        <section className={styles.faqList}>
                            {CONTACTS.map((contact) => (
                                <article key={contact.label} className={styles.faqItem}>
                                    <h2>{contact.label}</h2>
                                    <p>{contact.detail}</p>
                                </article>
                            ))}
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}
