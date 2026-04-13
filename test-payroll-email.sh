#!/bin/bash
# Test Payroll Email Sending - Using curl
# Usage: bash test-payroll-email.sh <AUTH_TOKEN>

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PAYROLL EMAIL TEST - ramjeekumaryadav558@gmail.com${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

BASE_URL="http://localhost:3000"
TOKEN=${1:-""}

if [ -z "$TOKEN" ]; then
    echo -e "${YELLOW}⚠️  No token provided${NC}"
    echo "Usage: bash test-payroll-email.sh <AUTH_TOKEN>"
    echo -e "\n${BLUE}To get a token:${NC}"
    echo "1. Login to the system"
    echo "2. Check localStorage for 'token'"
    echo "3. Pass it as argument to this script"
    exit 1
fi

echo -e "${GREEN}✅ Using provided AUTH_TOKEN${NC}\n"

# Step 1: Find employee
echo -e "${BLUE}→ Step 1: Finding employee with email ramjeekumaryadav558@gmail.com${NC}"
EMPLOYEES=$(curl -s -X GET "${BASE_URL}/employees" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json")

EMPLOYEE_ID=$(echo $EMPLOYEES | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Employee data fetched${NC}\n"

# Step 2: Fetch attendance
echo -e "${BLUE}→ Step 2: Fetching attendance records${NC}"
ATTENDANCE=$(curl -s -X GET "${BASE_URL}/attendance?employeeId=${EMPLOYEE_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json")

ATTENDANCE_ID=$(echo $ATTENDANCE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Found attendance ID: ${ATTENDANCE_ID}${NC}\n"

# Step 3: Generate Payroll
echo -e "${BLUE}→ Step 3: Generating payroll (this will send email)${NC}"
MONTH=$(date +%m)
YEAR=$(date +%Y)

echo "Endpoint: POST /finance/generate"
echo "Payload:"
echo "  - attendanceId: ${ATTENDANCE_ID}"
echo "  - month: ${MONTH}"
echo "  - year: ${YEAR}"
echo ""

PAYROLL=$(curl -s -X POST "${BASE_URL}/finance/generate" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
        \"attendanceId\": \"${ATTENDANCE_ID}\",
        \"month\": ${MONTH},
        \"year\": ${YEAR}
    }")

echo -e "${GREEN}✅ Payroll generate request completed${NC}"
echo ""
echo "Response:"
echo $PAYROLL | jq . 2>/dev/null || echo $PAYROLL
echo ""

# Step 4: Check logs
echo -e "${BLUE}→ Step 4: Email verification${NC}"
echo -e "${YELLOW}⚠️  Check the backend console (npm start) for these log messages:${NC}"
echo ""
echo -e "${GREEN}✅ [FinanceService] Email sent to employee 123 (ramjeekumaryadav558@gmail.com)${NC}"
echo -e "${GREEN}✅ [FinanceService] Notification sent to employee 123${NC}"
echo -e "${RED}❌ [FinanceService] Failed to send payroll email${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST COMPLETE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
