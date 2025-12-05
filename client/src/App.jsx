import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashsboard from './pages/Dashsboard'
import Community from './pages/Community'
import BlogTitles from './pages/BlogTitles'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import WriteArticle from './pages/WriteArticle'
import Layout from './pages/Layout'
import GenerateImages from './pages/GenerateImages'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import {Toaster} from 'react-hot-toast'


const App = () => {
  
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path ='/ai' element ={<Layout />}> 
          <Route index element ={<Dashsboard />} />
          <Route path="community" element ={<Community />} />
          <Route path="blog-titles" element ={<BlogTitles />} />
          <Route path="remove-background" element ={<RemoveBackground />} />
          <Route path="remove-object" element ={<RemoveObject />} />
          <Route path="review-resume" element ={<ReviewResume />} />
          <Route path="write-article" element ={<WriteArticle />} />
          <Route path="generate-images" element ={<GenerateImages />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App