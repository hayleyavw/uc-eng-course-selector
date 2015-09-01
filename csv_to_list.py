"""
Author: Hayley van Waas

Converts csv file to list
"""

import csv

CSV_TO_CONVERT = "rules4.csv"  # change this to filename of csv to convert

rules_list = []

# save csv to list
with open(CSV_TO_CONVERT) as csvfile:
    reader = csv.reader(csvfile)
    rules_list = list(reader)

# ouput list (copy this into JavaScript file)
print("table =", rules_list)
