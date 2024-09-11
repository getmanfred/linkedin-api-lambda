# Linkedin API Lambda

This Lambda function processes requests to import LinkedIn profiles. It uses LinkedIn's [Member Data Portability (Member) API](https://learn.microsoft.com/en-us/linkedin/dma/member-data-portability/member-data-portability-member/?view=li-dma-data-portability-2024-08) to retrieve relevant profile data and returns a CV in [MAc format](https://github.com/getmanfred/mac).

_Note: This API is available only to LinkedIn users registered in the European Union._

![Flow](./assets/diagram.drawio.png)


# Environment variables

TBD

# How to develop

TBD

# References

TDB


# TODO
- Core logic
- Github action to deploy in aws
- Github action to audit periodically
- Send result to SQS queue
