// Run this with: npx ts-node scripts/test-cron.ts

async function testCron() {
  const cronSecret = process.env.CRON_SECRET
  
  console.log('🧪 Testing cron endpoint...')
  console.log('⏰ Calling: http://localhost:3000/api/cron/update-journey-status')
  
  try {
    const response = await fetch('http://localhost:3000/api/cron/update-journey-statuses', {
      headers: {
        'Authorization': `Bearer ${cronSecret}`
      }
    })
    
    const data = await response.json()
    
    console.log('\n📊 Response:')
    console.log(JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('\n✅ Cron test successful!')
    } else {
      console.log('\n❌ Cron test failed!')
    }
  } catch (error) {
    console.error('\n❌ Error:', error)
  }
}

testCron()