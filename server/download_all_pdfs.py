#!/usr/bin/env python3
"""Download all investor PDFs from Granules India website."""

import os
import urllib.request
import urllib.parse
import sys
import time

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'pdfs')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# All PDFs organized by category
# Format: (url, local_filename, category, label)
PDFS = [
    # ===== QUARTERLY RESULTS (53 PDFs) =====
    ("https://granulesindia.com/wp-content/uploads/2026/07/FY-Result-Jun26.pdf", "quarterly-fy27-q1.pdf", "quarterly", "Q1 FY27"),
    ("https://granulesindia.com/wp-content/uploads/2025/08/Results-SEBI-reports.pdf", "quarterly-fy26-q1.pdf", "quarterly", "Q1 FY26"),
    ("https://granulesindia.com/wp-content/uploads/2025/11/Results-and-Audit-report.pdf", "quarterly-fy26-q2.pdf", "quarterly", "Q2 FY26"),
    ("https://granulesindia.com/wp-content/uploads/2026/01/GLL-Third-Quarter.pdf", "quarterly-fy26-q3.pdf", "quarterly", "Q3 FY26"),
    ("https://granulesindia.com/wp-content/uploads/2026/04/Q4-Financials-FY26%E2%80%93Fourth-Quarter.pdf", "quarterly-fy26-q4.pdf", "quarterly", "Q4 FY26"),
    ("https://granulesindia.com/wp-content/uploads/2024/07/fq-25-Results.pdf", "quarterly-fy25-q1.pdf", "quarterly", "Q1 FY25"),
    ("https://granulesindia.com/wp-content/uploads/2024/11/FY25-%E2%80%93-Second-Quarter.pdf", "quarterly-fy25-q2.pdf", "quarterly", "Q2 FY25"),
    ("https://granulesindia.com/wp-content/uploads/2025/01/Signed-Results-Dec-24-Third-Quarter.pdf", "quarterly-fy25-q3.pdf", "quarterly", "Q3 FY25"),
    ("https://granulesindia.com/wp-content/uploads/2025/05/NSEBSE-FINANCIALS-25.pdf", "quarterly-fy25-q4.pdf", "quarterly", "Q4 FY25"),
    ("https://granulesindia.com/wp-content/uploads/2023/08/First-Quarter-Combined-File.pdf", "quarterly-fy24-q1.pdf", "quarterly", "Q1 FY24"),
    ("https://granulesindia.com/wp-content/uploads/2023/11/Results-Q2FY24.pdf", "quarterly-fy24-q2.pdf", "quarterly", "Q2 FY24"),
    ("https://granulesindia.com/wp-content/uploads/2024/01/third-quarter-financial-Q3.pdf", "quarterly-fy24-q3.pdf", "quarterly", "Q3 FY24"),
    ("https://granulesindia.com/wp-content/uploads/2024/05/Financials-Website-Q4.pdf", "quarterly-fy24-q4.pdf", "quarterly", "Q4 FY24"),
    ("https://granulesindia.com/wp-content/uploads/2022/08/Results-Q1-2022.pdf", "quarterly-fy23-q1.pdf", "quarterly", "Q1 FY23"),
    ("https://granulesindia.com/wp-content/uploads/2022/10/FY23-Quarterly-Results-Second-Quarter.pdf", "quarterly-fy23-q2.pdf", "quarterly", "Q2 FY23"),
    ("https://granulesindia.com/wp-content/uploads/2023/01/Quarterly-Results-third-quarter-FY23.pdf", "quarterly-fy23-q3.pdf", "quarterly", "Q3 FY23"),
    ("https://granulesindia.com/wp-content/uploads/2023/05/Financials-Website-Fourth-Quarter.pdf", "quarterly-fy23-q4.pdf", "quarterly", "Q4 FY23"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/2370QuarterlyResultsTab%E2%80%93FY22-FirstQuarter.pdf", "quarterly-fy22-q1.pdf", "quarterly", "Q1 FY22"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/FY22SecondQuarter.pdf", "quarterly-fy22-q2.pdf", "quarterly", "Q2 FY22"),
    ("https://granulesindia.com/wp-content/uploads/2022/02/Quarterly-Results-%E2%80%93-FY22-%E2%80%93-Third-quarter.pdf", "quarterly-fy22-q3.pdf", "quarterly", "Q3 FY22"),
    ("https://granulesindia.com/wp-content/uploads/2022/05/Financial%20Result%2018.05.2022.pdf", "quarterly-fy22-q4.pdf", "quarterly", "Q4 FY22"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/8549WEBSITE.pdf", "quarterly-fy21-q1.pdf", "quarterly", "Q1 FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/2787BSR00431620201020120036.pdf", "quarterly-fy21-q2.pdf", "quarterly", "Q2 FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/6020Website.pdf", "quarterly-fy21-q3.pdf", "quarterly", "Q3 FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/7264RESULTSWEBSITE.pdf", "quarterly-fy21-q4.pdf", "quarterly", "Q4 FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/4193Results-Website.pdf", "quarterly-fy20-q1.pdf", "quarterly", "Q1 FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/6337RESULTSQ2.pdf", "quarterly-fy20-q2.pdf", "quarterly", "Q2 FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/1676RESULTS.pdf", "quarterly-fy20-q3.pdf", "quarterly", "Q3 FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/5497WEBSITE.pdf", "quarterly-fy20-q4.pdf", "quarterly", "Q4 FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/2659Results%20-%20Website.pdf", "quarterly-fy19-q1.pdf", "quarterly", "Q1 FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/5737FY-19-Second.pdf", "quarterly-fy19-q2.pdf", "quarterly", "Q2 FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/6849WEBSITE.pdf", "quarterly-fy19-q3.pdf", "quarterly", "Q3 FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/4137Websiteresults.pdf", "quarterly-fy19-q4.pdf", "quarterly", "Q4 FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/8343WEBSITE.pdf", "quarterly-fy18-q1.pdf", "quarterly", "Q1 FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/5817WEBSITE.pdf", "quarterly-fy18-q2.pdf", "quarterly", "Q2 FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/3038WEBSITE.pdf", "quarterly-fy18-q3.pdf", "quarterly", "Q3 FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/4965WEBSITE_.pdf", "quarterly-fy18-q4.pdf", "quarterly", "Q4 FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/6689Results.pdf", "quarterly-fy17-q1.pdf", "quarterly", "Q1 FY17"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/8787FY17-Second.pdf", "quarterly-fy17-q2.pdf", "quarterly", "Q2 FY17"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/5408WEBSITE28.pdf", "quarterly-fy17-q3.pdf", "quarterly", "Q3 FY17"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/3039WEBSITE.pdf", "quarterly-fy17-q4.pdf", "quarterly", "Q4 FY17"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/9883First%20Quarter%20FY16.pdf", "quarterly-fy16-q1.pdf", "quarterly", "Q1 FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/9529Second%20Quarter%20FY16.pdf", "quarterly-fy16-q2.pdf", "quarterly", "Q2 FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/8771Third%20Quarter%20FY16.pdf", "quarterly-fy16-q3.pdf", "quarterly", "Q3 FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/7322Fourth%20Quarter%20FY16.pdf", "quarterly-fy16-q4.pdf", "quarterly", "Q4 FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/9952First%20Quarter%20FY15.pdf", "quarterly-fy15-q1.pdf", "quarterly", "Q1 FY15"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/5926Second%20Quarter%20FY15.pdf", "quarterly-fy15-q2.pdf", "quarterly", "Q2 FY15"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/7954Third%20Quarter%20FY15.pdf", "quarterly-fy15-q3.pdf", "quarterly", "Q3 FY15"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/5426Fourth%20Quarter%20FY15.pdf", "quarterly-fy15-q4.pdf", "quarterly", "Q4 FY15"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/2037First%20Quarter%20FY14.pdf", "quarterly-fy14-q1.pdf", "quarterly", "Q1 FY14"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/8233Second%20Quarter%20FY14.pdf", "quarterly-fy14-q2.pdf", "quarterly", "Q2 FY14"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/3637Third%20Quarter%20FY14.pdf", "quarterly-fy14-q3.pdf", "quarterly", "Q3 FY14"),
    ("https://granulesindia.com/wp-content/uploads/pdf/quarterly1/3337Fourth%20Quarter%20FY14.pdf", "quarterly-fy14-q4.pdf", "quarterly", "Q4 FY14"),

    # ===== INVESTOR PRESENTATIONS (33 PDFs) =====
    ("https://granulesindia.com/wp-content/uploads/2026/07/Earnings-Presentation-Q1FY27vf.pdf", "investor-presentation-fy27-q1.pdf", "investor-presentation", "Q1 FY27"),
    ("https://granulesindia.com/wp-content/uploads/2025/08/Earnings-Presentation-Q1FY26.pdf", "investor-presentation-fy26-q1.pdf", "investor-presentation", "Q1 FY26"),
    ("https://granulesindia.com/wp-content/uploads/2025/11/Earnings-Presentation-Q2FY26-Circulation.pdf", "investor-presentation-fy26-q2.pdf", "investor-presentation", "Q2 FY26"),
    ("https://granulesindia.com/wp-content/uploads/2026/01/Earnings-Presentation-Q3FY26.pdf", "investor-presentation-fy26-q3.pdf", "investor-presentation", "Q3 FY26"),
    ("https://granulesindia.com/wp-content/uploads/2026/04/Earnings-Presentation-FY26.pdf", "investor-presentation-fy26-q4.pdf", "investor-presentation", "Q4 FY26"),
    ("https://granulesindia.com/wp-content/uploads/2024/07/GranulesQ1-FY-25-Earnings-Presentation.pdf", "investor-presentation-fy25-q1.pdf", "investor-presentation", "Q1 FY25"),
    ("https://granulesindia.com/wp-content/uploads/2024/11/Granules_Q2-FY-25-Earnings-Presentation-.pdf", "investor-presentation-fy25-q2.pdf", "investor-presentation", "Q2 FY25"),
    ("https://granulesindia.com/wp-content/uploads/2025/01/Granules_Q3-FY-25-Earnings-Presentation.pdf", "investor-presentation-fy25-q3.pdf", "investor-presentation", "Q3 FY25"),
    ("https://granulesindia.com/wp-content/uploads/2025/05/Granules_Q4-FY-25-Earnings-Presentation.pdf", "investor-presentation-fy25-q4.pdf", "investor-presentation", "Q4 FY25"),
    ("https://granulesindia.com/wp-content/uploads/2024/07/Granules-Q1-FY-25-Earnings-Presentation.pdf", "investor-presentation-fy24-q1.pdf", "investor-presentation", "Q1 FY24"),
    ("https://granulesindia.com/wp-content/uploads/2023/11/Earnings-Presentation-Q2FY24.pdf", "investor-presentation-fy24-q2.pdf", "investor-presentation", "Q2 FY24"),
    ("https://granulesindia.com/wp-content/uploads/2024/01/Earnings-Presentation-Q3FY24.pdf", "investor-presentation-fy24-q3.pdf", "investor-presentation", "Q3 FY24"),
    ("https://granulesindia.com/wp-content/uploads/2024/05/Earnings-Presentation-Q4FY24.pdf", "investor-presentation-fy24-q4.pdf", "investor-presentation", "Q4 FY24"),
    ("https://granulesindia.com/wp-content/uploads/2022/08/GIL_Earnings-Q1FY23-final-for-release.pdf", "investor-presentation-fy23-q1.pdf", "investor-presentation", "Q1 FY23"),
    ("https://granulesindia.com/wp-content/uploads/2022/10/GIL_Earnings-Q2FY23-final-for-release.pdf", "investor-presentation-fy23-q2.pdf", "investor-presentation", "Q2 FY23"),
    ("https://granulesindia.com/wp-content/uploads/2023/01/GIL_Earnings-Q3FY23-Final.pdf", "investor-presentation-fy23-q3.pdf", "investor-presentation", "Q3 FY23"),
    ("https://granulesindia.com/wp-content/uploads/2023/05/GIL-Earnings-Presentation-Q4FY23-Final.pdf", "investor-presentation-fy23-q4.pdf", "investor-presentation", "Q4 FY23"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/7346Investor%20earnings%20presentation%20final%20for%20release.pdf", "investor-presentation-fy22-q1.pdf", "investor-presentation", "Q1 FY22"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/FY22-Investor%20Presentation%20final%20for%20release.pdf", "investor-presentation-fy22-q2.pdf", "investor-presentation", "Q2 FY22"),
    ("https://granulesindia.com/wp-content/uploads/2022/02/Investor-PPT-Q3FY22-final-for-release.pdf", "investor-presentation-fy22-q3.pdf", "investor-presentation", "Q3 FY22"),
    ("https://granulesindia.com/wp-content/uploads/2022/05/GIL_Earnings%20Q4FY22_V2.pdf", "investor-presentation-fy22-q4.pdf", "investor-presentation", "Q4 FY22"),
    ("https://granulesindia.com/wp-content/uploads/pdf/5753Granules_Investor%20Presentation.pdf", "investor-presentation-fy21-q1.pdf", "investor-presentation", "Q1 FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/1891GIL_Q2FY21_PPT%20Final.pdf", "investor-presentation-fy21-q2.pdf", "investor-presentation", "Q2 FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/5341GIL_Q3FY21_Final.pdf", "investor-presentation-fy21-q3.pdf", "investor-presentation", "Q3 FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/5380Investor%20Presentation%20final.pdf", "investor-presentation-fy21-q4.pdf", "investor-presentation", "Q4 FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/8124Granules_Investor%20Presentation_Q1FY20.pdf", "investor-presentation-fy20-q1.pdf", "investor-presentation", "Q1 FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/1955Granules_Investor%20Presentation.pdf", "investor-presentation-fy20-q2.pdf", "investor-presentation", "Q2 FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/5084Granules%20India%20Q3FY20%20Earnings%20.pdf", "investor-presentation-fy20-q3.pdf", "investor-presentation", "Q3 FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/6078Investor%20PPT.pdf", "investor-presentation-fy20-q4.pdf", "investor-presentation", "Q4 FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/2760Granules_Investor%20Presentation.pdf", "investor-presentation-fy19-q1.pdf", "investor-presentation", "Q1 FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/7188Granules_Investor%20Presentation_Q2FY19.pdf", "investor-presentation-fy19-q2.pdf", "investor-presentation", "Q2 FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/5741Granules_Investor%20Presentation_Q3FY19_Final.pdf", "investor-presentation-fy19-q3.pdf", "investor-presentation", "Q3 FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/5443Granules_Investor%20Presentation_Q4FY19.pdf", "investor-presentation-fy19-q4.pdf", "investor-presentation", "Q4 FY19"),

    # ===== SUBSIDIARY ACCOUNTS (54 PDFs) =====
    ("https://granulesindia.com/wp-content/uploads/2026/07/Granules-CZRO-Private-Limited.pdf", "subsidiary-fy26-czro.pdf", "subsidiary", "CZRO FY26"),
    ("https://granulesindia.com/wp-content/uploads/2026/07/Granules-Life-Sciences-Private-Limited.pdf", "subsidiary-fy26-lifesciences.pdf", "subsidiary", "Life Sciences FY26"),
    ("https://granulesindia.com/wp-content/uploads/2026/07/Granules-Pharmaceuticals-GMBH-1.pdf", "subsidiary-fy26-pharma-gmbh.pdf", "subsidiary", "Pharma GmbH FY26"),
    ("https://granulesindia.com/wp-content/uploads/2026/07/Granules-Pharmaceuticals-Inc-26.pdf", "subsidiary-fy26-pharma-inc.pdf", "subsidiary", "Pharma Inc FY26"),
    ("https://granulesindia.com/wp-content/uploads/2026/07/Ascelis-Peptides-Private-Limited.pdf", "subsidiary-fy26-ascelis.pdf", "subsidiary", "Ascelis Peptides FY26"),
    ("https://granulesindia.com/wp-content/uploads/2025/07/Granules-CZRO-Private-Limited.pdf", "subsidiary-fy25-czro.pdf", "subsidiary", "CZRO FY25"),
    ("https://granulesindia.com/wp-content/uploads/2025/07/Granules-Life-Sciences-Private-Limited.pdf", "subsidiary-fy25-lifesciences.pdf", "subsidiary", "Life Sciences FY25"),
    ("https://granulesindia.com/wp-content/uploads/2025/07/Granules-Peptides-Private-Limited.pdf", "subsidiary-fy25-peptides.pdf", "subsidiary", "Peptides FY25"),
    ("https://granulesindia.com/wp-content/uploads/2025/07/Granules-Pharmaceuticals-Inc.pdf", "subsidiary-fy25-pharma-inc.pdf", "subsidiary", "Pharma Inc FY25"),
    ("https://granulesindia.com/wp-content/uploads/2025/07/Granules-USA-Inc.pdf", "subsidiary-fy25-usa.pdf", "subsidiary", "USA Inc FY25"),
    ("https://granulesindia.com/wp-content/uploads/2024/07/GLSPL.pdf", "subsidiary-fy24-lifesciences.pdf", "subsidiary", "Life Sciences FY24"),
    ("https://granulesindia.com/wp-content/uploads/2024/07/GCZRO.pdf", "subsidiary-fy24-czro.pdf", "subsidiary", "CZRO FY24"),
    ("https://granulesindia.com/wp-content/uploads/2024/07/GPI-24.pdf", "subsidiary-fy24-pharma-inc.pdf", "subsidiary", "Pharma Inc FY24"),
    ("https://granulesindia.com/wp-content/uploads/2024/07/GUSA-24.pdf", "subsidiary-fy24-usa.pdf", "subsidiary", "USA Inc FY24"),
    ("https://granulesindia.com/wp-content/uploads/2024/07/Granules-signed-2024-accounts.pdf", "subsidiary-fy24-europe.pdf", "subsidiary", "Europe Ltd FY24"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/Financials-CZRO-2023.pdf", "subsidiary-fy23-czro.pdf", "subsidiary", "CZRO FY23"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/GPI-2023.pdf", "subsidiary-fy23-pharma-inc.pdf", "subsidiary", "Pharma Inc FY23"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/GEL-2023.pdf", "subsidiary-fy23-europe.pdf", "subsidiary", "Europe Ltd FY23"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/GLSPL-2023.pdf", "subsidiary-fy23-lifesciences.pdf", "subsidiary", "Life Sciences FY23"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/GUSA-2023.pdf", "subsidiary-fy23-usa.pdf", "subsidiary", "USA Inc FY23"),
    ("https://granulesindia.com/wp-content/uploads/2022/07/Granules-Life-Sciences-Private-Limited.pdf", "subsidiary-fy22-lifesciences.pdf", "subsidiary", "Life Sciences FY22"),
    ("https://granulesindia.com/wp-content/uploads/2022/07/Granules-USA-Inc..pdf", "subsidiary-fy22-usa.pdf", "subsidiary", "USA Inc FY22"),
    ("https://granulesindia.com/wp-content/uploads/2022/07/Granules-Pharmaceuticals-Inc..pdf", "subsidiary-fy22-pharma-inc.pdf", "subsidiary", "Pharma Inc FY22"),
    ("https://granulesindia.com/wp-content/uploads/2022/07/Granules-Europe-Limited.pdf", "subsidiary-fy22-europe.pdf", "subsidiary", "Europe Ltd FY22"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/4869Granules%20Life%20Sciences%20Pvt.%20Ltd.pdf", "subsidiary-fy21-lifesciences.pdf", "subsidiary", "Life Sciences FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/4514Granules%20Europe%20Limited.pdf", "subsidiary-fy21-europe.pdf", "subsidiary", "Europe Ltd FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/9854Granules%20USA%2C%20Inc..pdf", "subsidiary-fy21-usa.pdf", "subsidiary", "USA Inc FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/investors/8178Granules%20Pharmaceuticals%2C%20Inc..pdf", "subsidiary-fy21-pharma-inc.pdf", "subsidiary", "Pharma Inc FY21"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/8780Granules%20Europe%20Limited.pdf", "subsidiary-fy20-europe.pdf", "subsidiary", "Europe Ltd FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/6768Granules%20USA%20,Inc..pdf", "subsidiary-fy20-usa.pdf", "subsidiary", "USA Inc FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/9134Granules%20Pharmaceuticals%2C%20Inc..pdf", "subsidiary-fy20-pharma-inc.pdf", "subsidiary", "Pharma Inc FY20"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/9469Granules%20Pharmaceuticals%2C%20Inc..pdf", "subsidiary-fy19-pharma-inc.pdf", "subsidiary", "Pharma Inc FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/2511Granules%20OmniChem%20Pvt%20Ltd-compressed.pdf", "subsidiary-fy19-omnichem.pdf", "subsidiary", "OmniChem FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/6043Granules%20Europe%20Limited.pdf", "subsidiary-fy19-europe.pdf", "subsidiary", "Europe Ltd FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/9462Granules%20-%20Biocause%20Pharmaceutical%20Company%20Limited.pdf", "subsidiary-fy19-biocause.pdf", "subsidiary", "Biocause FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/4651Granules%20USA%20Inc.pdf", "subsidiary-fy19-usa.pdf", "subsidiary", "USA Inc FY19"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/6867GR184%20Signed%20full%20accounts%2031.3.18.pdf", "subsidiary-fy18-europe.pdf", "subsidiary", "Europe Ltd FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/2024Biocause.pdf", "subsidiary-fy18-biocause.pdf", "subsidiary", "Biocause FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/9853GOPL%20Financials%2017-18-min.pdf", "subsidiary-fy18-omnichem.pdf", "subsidiary", "OmniChem FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/7030Review%20Report%20-%20GPI%20-%20Final%20-%20Signed.pdf", "subsidiary-fy18-pharma-inc.pdf", "subsidiary", "Pharma Inc FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/3544Granules%20USA%20-%20Signed%20Review%20Report%20-%20FY%202017-18.pdf", "subsidiary-fy18-usa.pdf", "subsidiary", "USA Inc FY18"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/3095Granules%20USA%20Inc..pdf", "subsidiary-fy17-usa.pdf", "subsidiary", "USA Inc FY17"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/2050Granules%20Pharmaceuticals%2C%20Inc..pdf", "subsidiary-fy17-pharma-inc.pdf", "subsidiary", "Pharma Inc FY17"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/7905Granules%20OmniChem%20Pvt.%20Ltd..pdf", "subsidiary-fy17-omnichem.pdf", "subsidiary", "OmniChem FY17"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/3558Granules%20-BiocausePharmaceutical%20Company%20Ltd..pdf", "subsidiary-fy17-biocause.pdf", "subsidiary", "Biocause FY17"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/4255Granules%20USA%2C%20Inc._Financias%20%202015-2016.pdf", "subsidiary-fy16-usa.pdf", "subsidiary", "USA Inc FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/6905Granules%20Pharmaceuticals%2C%20Inc_Financias%20%202015-2016.pdf", "subsidiary-fy16-pharma-inc.pdf", "subsidiary", "Pharma Inc FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/6923Granules%20OmniChem%20Pvt.%20Ltd.%20FY%2015-16.pdf", "subsidiary-fy16-omnichem.pdf", "subsidiary", "OmniChem FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/5606GIL%20Lifesciences%20Pvt.%20Ltd.-2015-16.pdf", "subsidiary-fy16-lifesciences.pdf", "subsidiary", "Lifesciences FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/9699BioCause-2015-16.pdf", "subsidiary-fy16-biocause.pdf", "subsidiary", "Biocause FY16"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/7234Granules%20Pharmaceuticals%20Inc.%20-%20March%2715.pdf", "subsidiary-fy15-pharma-inc.pdf", "subsidiary", "Pharma Inc FY15"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/5748Granules%20Omnichem%20Pvt.%20Ltd%20FY-2014-15.pdf", "subsidiary-fy15-omnichem.pdf", "subsidiary", "OmniChem FY15"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/3322GIL%20Lifescience%20Pvt%20Ltd.%20-%20FY%202014-15.pdf", "subsidiary-fy15-lifesciences.pdf", "subsidiary", "Lifesciences FY15"),
    ("https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/7780Biocause-Granules%20Pharmaceutical%20Company%20Ltd%20-%20FY14-15.pdf", "subsidiary-fy15-biocause.pdf", "subsidiary", "Biocause FY15"),
]

def download_all():
    """Download all PDFs."""
    downloaded = 0
    skipped = 0
    failed = 0

    for i, (url, filename, category, label) in enumerate(PDFS, 1):
        filepath = os.path.join(OUTPUT_DIR, filename)

        if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
            skipped += 1
            continue

        try:
            encoded_url = urllib.parse.quote(url, safe=':/?=&%')
            urllib.request.urlretrieve(encoded_url, filepath)
            size_mb = os.path.getsize(filepath) / (1024 * 1024)
            downloaded += 1
            print(f"[{i}/{len(PDFS)}] {category}: {label} ({size_mb:.1f} MB)")
        except Exception as e:
            failed += 1
            print(f"[{i}/{len(PDFS)}] FAILED: {label} - {e}")

    print(f"\n{'='*60}")
    print(f"Downloaded: {downloaded}")
    print(f"Skipped (already exists): {skipped}")
    print(f"Failed: {failed}")
    print(f"Total PDFs: {len(PDFS)}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"{'='*60}")

if __name__ == '__main__':
    download_all()
