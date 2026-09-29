/**
 * Fast2SMS & Clinical Referral Dispatch Service (Offline / Online Hybrid)
 * Formats clinical triage slips and simulates SMS delivery to PHC Medical Officers.
 */

export async function sendReferralSMS(toNumber, messagePayload) {
  // Simulate network latency / offline queueing
  await new Promise((resolve) => setTimeout(resolve, 650));

  const messageId = 'F2SMS-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const sentAt = new Date().toISOString();

  // Save to local dispatch log
  try {
    const existing = JSON.parse(localStorage.getItem('luma_referral_sms_log') || '[]');
    existing.unshift({
      id: messageId,
      to: toNumber,
      payload: messagePayload,
      sentAt,
      status: 'DELIVERED_TO_TELCO'
    });
    localStorage.setItem('luma_referral_sms_log', JSON.stringify(existing.slice(0, 50)));
  } catch {}

  return {
    ok: true,
    messageId,
    sentAt,
    recipient: toNumber,
    status: 'Delivered to PHC Dispatch Queue'
  };
}

export function formatReferralSlip({ patient, diagnosis, phc, clinicalHistory }) {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return `
==================================================
           GOVERNMENT OF INDIA / NHA HFR
        CLINICAL DERMATOLOGY REFERRAL SLIP
==================================================
REF ID: REF-${Date.now().toString(36).toUpperCase()}
DATE: ${dateStr}

PATIENT INFORMATION:
- Name: ${patient.fullName || 'Anonymous / Unregistered'}
- Age/Sex: ${patient.age ? `${patient.age} Yrs` : 'N/A'} / ${patient.sex || 'N/A'}
- Weight: ${patient.weight ? `${patient.weight} kg` : 'N/A'}
- Village/Location: ${patient.village || 'N/A'}

DIAGNOSTIC FINDINGS (DermAI v2.4 Offline Engine):
- Detected Condition: ${diagnosis.condition}
- Confidence Score: ${diagnosis.confidence}%
- Clinical Severity & Risk: ${diagnosis.risk} RISK
- Lesion Morphology: ${diagnosis.lesionType || 'Skin Lesion'}
- Fitzpatrick Phototype: Type ${diagnosis.fitzpatrick} (Melanin Calibrated)
- Ambient Illuminant: ${diagnosis.illuminant || 'Daylight'}
- RGB Diagnostic Reliability: ${diagnosis.rgbReliability || 90}%

CLINICAL DIRECTIVE FOR OPERATOR:
${diagnosis.directive}

REFERRED HEALTH FACILITY:
- Facility: ${phc.name}
- NHA HFR Code: ${phc.code}
- District: ${phc.district}
- Medical Officer: ${phc.medicalOfficer || 'On-Duty MO'}
- Contact Helpline: ${phc.contact}
==================================================
This is an automated assistive referral under ABDM guidelines.
`;
}
