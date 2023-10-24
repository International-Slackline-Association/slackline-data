# ISA Members

This is a list of slackline groups recognized by International Slackline Association (ISA). They are displayed on the [SlackMap](https://slackmap.com/communities).

**⚠️ Warning:** Only administrators of ISA can edit this list. If you think the data is incorrect or missing please contact us: **slackmap@slacklineinternational.org**

### JSON Format for `members.json`

```ts
interface ISAMember {
  name: string;
  email: string;
  country: string; // ISO2 country code
  memberType: "active" | "associate" | "observer" | "partner";
  infoUrl?: string; // optional
  groupId?: string: // optional
  profilePictureUrl?: string; // optional
}
```
