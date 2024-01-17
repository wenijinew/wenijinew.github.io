## Domain Management

Go to [Google Domain](https://domains.google.com) and open the target domain. Then click `DNS`, in `Resource Records`, create a new record and fill the below fields:

- Host name: `www`
- Type: `CNAME`
- TTL: `3600`
- Data: `wenijinew.github.io.` if the site is to host on [github](https://pages.github.com/). `ubiquitous-boba-dbb112.netlify.app.` if the site is to host on [netlify](https://app.netlify.com/). Note: For [netlify](https://app.netlify.com/), you need to check in the `Domain Management` of your site. Check [Manage domains for your production site](https://docs.netlify.com/domains-https/custom-domains/multiple-domains/#manage-domains-for-your-production-site) for more information.
