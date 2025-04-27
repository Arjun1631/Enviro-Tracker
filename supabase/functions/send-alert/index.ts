import { Resend } from 'npm:resend@1.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertData {
  sensorType: string;
  value: number;
  expectedRange: string;
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse and validate request body
    const data = await req.json() as AlertData;
    if (!data.sensorType || !data.value || !data.expectedRange || !data.timestamp) {
      throw new Error('Missing required fields');
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const userEmail = 'Arjun162k3@gmail.com';

    const subject = `⚠️ Alert: Abnormal ${data.sensorType} Detected`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">⚠️ Environmental Alert</h2>
        
        <p>Hi,</p>
        
        <p>An unusual <strong>${data.sensorType}</strong> level was detected at ${data.timestamp}.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;">📍 <strong>Value Detected:</strong> ${data.value}</p>
          <p style="margin: 5px 0;">📊 <strong>Expected Range:</strong> ${data.expectedRange}</p>
        </div>
        
        <p>Please take necessary action or monitor the system.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="color: #6b7280; font-size: 14px;">
          - EnviroTrack AI Monitoring System
        </p>
      </div>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'EnviroTrack <onboarding@resend.dev>',
      to: userEmail,
      subject,
      html,
    });

    if (emailError) {
      console.error('Resend API Error:', emailError);
      throw new Error('Failed to send email via Resend');
    }

    return new Response(
      JSON.stringify({ 
        message: 'Alert email sent successfully',
        id: emailData?.id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-alert function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send alert email', 
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});