type ResourceType = 'video' | 'article' | 'docs' | 'course' | 'book' | 'other'

interface ResourcePattern {
  type: ResourceType
  patterns: string[]
}

// ========================================
// RESOURCE TYPE PATTERNS
// ========================================

const RESOURCE_PATTERNS: ResourcePattern[] = [
  // Video platforms
  {
    type: 'video',
    patterns: [
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'wistia.com',
      'loom.com',
      'dailymotion.com',
      'twitch.tv',
      'streamable.com',
    ]
  },
  
  // Documentation sites
  {
    type: 'docs',
    patterns: [
        '/doc',
      '/docs',
      '/documentation',
      'docs.',
      'developer.',
      '.dev/',
      '.dev',
      'golang.org',
      'go.dev',
      'react.dev',
      'reactjs.org',
      'nextjs.org',
      'vuejs.org',
      'svelte.dev',
      'angular.io',
      'laravel.com/docs',
      'django-doc',
      'flask.palletsprojects.com',
      'expressjs.com',
      'nestjs.com',
      'fastapi.tiangolo.com',
      'spring.io/guides',
      'kotlinlang.org',
      'swift.org/documentation',
      'rust-lang.org',
      'typescriptlang.org',
      'javascript.info',
      'developer.mozilla.org',
      'w3schools.com',
      'devdocs.io',
      'readthedocs.io',
      'doc.rust-lang.org',
      'docs.python.org',
      'ruby-doc.org',
      'php.net/manual',
      'nodejs.org/docs',
      'api.jquery.com',
      'tailwindcss.com/docs',
      'getbootstrap.com/docs',
      'mui.com',
      'chakra-ui.com',
      'prisma.io/docs',
      'strapi.io/documentation',
      'graphql.org',
      'apollographql.com/docs',
      'trpc.io',
      'nextauthjs.org',
      'clerk.com/docs',
      'supabase.com/docs',
      'firebase.google.com/docs',
      'vercel.com/docs',
      'netlify.com/docs',
      'railway.app/docs',
      'render.com/docs',
      'aws.amazon.com/documentation',
      'cloud.google.com/docs',
      'azure.microsoft.com/documentation',
      'kubernetes.io/docs',
      'docker.com/docs',
      'git-scm.com/doc',
      'github.com/docs',
      'docs.github.com',
    ]
  },
  
  // Course platforms
  {
    type: 'course',
    patterns: [
      'udemy.com',
      'coursera.org',
      'edx.org',
      'pluralsight.com',
      'linkedin.com/learning',
      'skillshare.com',
      'udacity.com',
      'codecademy.com',
      'freecodecamp.org',
      'khanacademy.org',
      'egghead.io',
      'frontendmasters.com',
      'levelup.com',
      'educative.io',
      'laracasts.com',
      'testautomationu.com',
      'scrimba.com',
      'zerotomastery.io',
      'epicreact.dev',
      'ui.dev',
      'designcode.io',
      'masterclass.com',
    ]
  },
  
  // Book platforms
  {
    type: 'book',
    patterns: [
      'amazon.com/dp/',
      'amazon.com/gp/product/',
      'goodreads.com',
      'oreilly.com',
      'manning.com',
      'packtpub.com',
      'apress.com',
      'nostarch.com',
      'pragprog.com',
      'leanpub.com',
      'gumroad.com',
    ]
  },
]

// ========================================
// DETECT RESOURCE TYPE
// ========================================

export function detectResourceType(url: string): ResourceType {
  const urlLower = url.toLowerCase()
  
  // Check each pattern category
  for (const { type, patterns } of RESOURCE_PATTERNS) {
    for (const pattern of patterns) {
      if (urlLower.includes(pattern)) {
        return type
      }
    }
  }
  
  // Fallback to 'other'
  return 'other'
}

// ========================================
// EXTRACT TITLE FROM URL
// ========================================

export function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace('www.', '')
    
    // Special cases for known domains
    const domainMap: Record<string, string> = {
      'youtube.com': 'YouTube Video',
      'youtu.be': 'YouTube Video',
      'go.dev': 'Go Documentation',
      'golang.org': 'Go Documentation',
      'react.dev': 'React Documentation',
      'nextjs.org': 'Next.js Documentation',
      'typescriptlang.org': 'TypeScript Documentation',
      'developer.mozilla.org': 'MDN Web Docs',
      'udemy.com': 'Udemy Course',
      'coursera.org': 'Coursera Course',
      'medium.com': 'Medium Article',
      'dev.to': 'Dev.to Article',
    }
    
    const baseDomain = hostname.split('.').slice(-2).join('.')
    if (domainMap[hostname]) {
      return domainMap[hostname]
    }
    if (domainMap[baseDomain]) {
      return domainMap[baseDomain]
    }
    
    // Extract from path if available
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1]
      const title = lastPart
        .replace(/[-_]/g, ' ')
        .replace(/\.(html|php|aspx)$/, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      if (title.length > 3) {
        return title
      }
    }
    
    // Fallback to domain name
    const domainName = hostname.split('.')[0]
    return domainName.charAt(0).toUpperCase() + domainName.slice(1)
  } catch {
    return 'Resource'
  }
}

// ========================================
// GET TYPE ICON
// ========================================

export function getResourceTypeIcon(type: ResourceType): string {
  switch (type) {
    case 'video': return '📺'
    case 'docs': return '📚'
    case 'article': return '📄'
    case 'course': return '🎓'
    case 'book': return '📖'
    case 'other': return '🔗'
  }
}

// ========================================
// GET TYPE BADGE CLASSES
// ========================================

export function getResourceTypeBadge(type: ResourceType): string {
  switch (type) {
    case 'video': return 'bg-red-100 text-red-700'
    case 'docs': return 'bg-blue-100 text-blue-700'
    case 'article': return 'bg-green-100 text-green-700'
    case 'course': return 'bg-purple-100 text-purple-700'
    case 'book': return 'bg-amber-100 text-amber-700'
    case 'other': return 'bg-slate-100 text-slate-700'
  }
}