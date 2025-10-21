// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
'use client';

import React from 'react'
import Hero from '../../components/home/Hero'
import { About } from '@/components/ui/skiper30'

const page = () => {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* About Section with Parallax Gallery */}
      <About />
    </>
  )
}

export default page

