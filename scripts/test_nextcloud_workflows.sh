#!/bin/bash
# Test script for Nextcloud n8n workflows

# Configuration - Update these variables
N8N_SERVER="https://n8n.pistachio.blueshroomhomestead.com"  # Updated n8n server URL from documentation

ENDPOINT_MODE="webhook-test"

# Workflow IDs
LIST_WORKFLOW_ID="nextcloud/list"   # List Files workflow
CREATE_WORKFLOW_ID="nextcloud/create" # Create File workflow
READ_WORKFLOW_ID="nextcloud/read"   # Read File workflow
UPDATE_WORKFLOW_ID="nextcloud/update" # Update File workflow
DELETE_WORKFLOW_ID="nextcloud/delete" # Delete File workflow

TEST_TEXT_CONTENT="This is a test file created by the Nextcloud workflow test script."
TEST_DIRECTORY="/test"               # Test directory path in Nextcloud
TEST_FILENAME="test-file.txt"        # Test filename
TEST_FILEPATH="$TEST_DIRECTORY/$TEST_FILENAME"

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Nextcloud n8n Workflows Test Script ===${NC}\n"

# Function to show test result
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ Success: $2${NC}"
    else
        echo -e "${RED}✗ Failed: $2${NC}"
        echo -e "${YELLOW}Response: $3${NC}"
    fi
    echo ""
}

# 1. Test List Files (root directory)
echo -e "${BLUE}Testing List Files (root directory):${NC}"
LIST_RESULT=$(curl -s "$N8N_SERVER/$ENDPOINT_MODE/$LIST_WORKFLOW_ID")
LIST_STATUS=$?
show_result $LIST_STATUS "List files in root directory" "$LIST_RESULT"

# 2. Test Create File
echo -e "${BLUE}Testing Create File:${NC}"
CREATE_RESULT=$(curl -s -X POST "$N8N_SERVER/$ENDPOINT_MODE/$CREATE_WORKFLOW_ID" \
    -H "Content-Type: application/json" \
    -d "{\"filePath\": \"$TEST_FILEPATH\", \"fileContent\": \"$TEST_TEXT_CONTENT\"}")
CREATE_STATUS=$?
show_result $CREATE_STATUS "Create file at $TEST_FILEPATH" "$CREATE_RESULT"

# 3. Test List Files with search parameter
echo -e "${BLUE}Testing List Files with search:${NC}"
SEARCH_RESULT=$(curl -s "$N8N_SERVER/$ENDPOINT_MODE/$LIST_WORKFLOW_ID?directory=$TEST_DIRECTORY&search=test")
SEARCH_STATUS=$?
show_result $SEARCH_STATUS "Search for files with term 'test'" "$SEARCH_RESULT"

# 4. Test Read File
echo -e "${BLUE}Testing Read File:${NC}"
READ_RESULT=$(curl -s "$N8N_SERVER/$ENDPOINT_MODE/$READ_WORKFLOW_ID?path=$TEST_FILEPATH")
READ_STATUS=$?
show_result $READ_STATUS "Read file from $TEST_FILEPATH" "$READ_RESULT"

# 5. Test Update File
echo -e "${BLUE}Testing Update File:${NC}"
UPDATE_CONTENT="$TEST_TEXT_CONTENT Updated at $(date)"
UPDATE_RESULT=$(curl -s -X POST "$N8N_SERVER/$ENDPOINT_MODE/$UPDATE_WORKFLOW_ID" \
    -H "Content-Type: application/json" \
    -d "{\"filePath\": \"$TEST_FILEPATH\", \"fileContent\": \"$UPDATE_CONTENT\"}")
UPDATE_STATUS=$?
show_result $UPDATE_STATUS "Update file at $TEST_FILEPATH" "$UPDATE_RESULT"

# 6. Test Read Updated File
echo -e "${BLUE}Testing Read Updated File:${NC}"
READ_UPDATED_RESULT=$(curl -s "$N8N_SERVER/$ENDPOINT_MODE/$READ_WORKFLOW_ID?path=$TEST_FILEPATH")
READ_UPDATED_STATUS=$?
show_result $READ_UPDATED_STATUS "Read updated file from $TEST_FILEPATH" "$READ_UPDATED_RESULT"

# 7. Test Delete File
echo -e "${BLUE}Testing Delete File:${NC}"
DELETE_RESULT=$(curl -s "$N8N_SERVER/$ENDPOINT_MODE/$DELETE_WORKFLOW_ID?path=$TEST_FILEPATH")
DELETE_STATUS=$?
show_result $DELETE_STATUS "Delete file at $TEST_FILEPATH" "$DELETE_RESULT"

# 8. Verify file was deleted
echo -e "${BLUE}Verifying file deletion:${NC}"
VERIFY_DELETE_RESULT=$(curl -s "$N8N_SERVER/$ENDPOINT_MODE/$READ_WORKFLOW_ID?path=$TEST_FILEPATH")
if [[ "$VERIFY_DELETE_RESULT" == *"does not exist"* || "$VERIFY_DELETE_RESULT" == *"Failed to read file"* ]]; then
    echo -e "${GREEN}✓ Success: File was properly deleted${NC}"
else
    echo -e "${RED}✗ Failed: File may still exist${NC}"
    echo -e "${YELLOW}Response: $VERIFY_DELETE_RESULT${NC}"
fi
echo ""

echo -e "${BLUE}=== Test Script Completed ===${NC}"
echo "Remember to activate the workflows and configure Nextcloud credentials in n8n before running this script."
