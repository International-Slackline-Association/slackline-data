# Batch Update Process

Process for adding/updating group data from CSV to JSON files.

## References to check

Check `data/communities/groups/README.md` for data structure

## AI Task - Parallel Workflow

Process CSV entries using parallel workflow for speed:

### For each CSV row:

1. **Clean and format data**:
   - Trim whitespace
   - Remove "No X" placeholders
   - Convert handles to full URLs (@handle → https://t.me/handle)
   - Convert DMS coordinates to decimal if needed
   - Remove parentheses from coordinates
   - Add https:// to URLs if missing
   - Add Country Code intelligently based on location/coordinates

2. **Format as object**:

```javascript
{
  "ID of Group(if empty, a new group will be created)": "",  // or existing ID
  "Name of Group / Club": "Name Here",
  "Email Adress": "email@example.com",
  "Website URL": "https://...",
  "Facebook Page URL": "https://...",
  "Facebook Groups URL": "https://...",
  "Telegram URL": "https://t.me/...",
  "Instagram URL": "https://instagram.com/...",
  "Whatsapp URL": "https://chat.whatsapp.com/...",
  "Coordinates": "latitude, longitude",  // keep as string
  "Country Code": "XX"  // 2-letter ISO code
}
```

3. **Present to user** for verification

4. **When user approves ("yes"/"go")**:
   - Launch background haiku agent to:
     - Run `node scripts/batchUpdate.js '<JSON_STRING>'` with the entry as JSON argument
     - If error: Report issue
   - **Immediately present next item** to user (don't wait for agent).
   - Agents can now run in **true parallel** without overwriting each other!

5. **Skip if**: No name, or new entry without coordinates

This parallel workflow allows continuous user review while agents handle execution in background.

Script handles: ID generation, coordinate reversal, dates, validation.
