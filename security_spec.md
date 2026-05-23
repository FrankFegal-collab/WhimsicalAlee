# Security Specification: The Whispering Woods Archive

## Data Invariants
1. **Posts:**
   - Public readers can read posts with `isDraft == false`. Only authentic custom roles or authenticated administrators (optional) or anyone if specified, but usually keeper edits posts. Drafts (`isDraft == true`) must be protected from anonymous visitors or readers if possible.
   - Anyone can increase/decrease `likes` and `bookmarks` by exactly 1, and increment `views` by 1.
   - Creating, updating other fields, and deleting posts is restricted to authorized owners/Keepers (in this application, since there is no Firebase Auth user mandatory for reading/commenting, we can allow public comment creation, view/like increments, but restrict administrative post writes).
2. **Comments:**
   - Anyone can create comments on a published post as a guest.
   - Comment content must be non-empty and under size limits (e.g., <= 1000 characters) to prevent Denial of Service.
   - Comments cannot be mutated or moved to different posts.

---

## The "Dirty Dozen" Payloads

1. **Payload 1: Post creation with missing required fields (e.g., missing Category or Title).**
   - *Attack:* Breaks schema completeness by omission.
2. **Payload 2: Post creation containing a Shadow Field (Ghost field `isVerified` or `arbitraryField`).**
   - *Attack:* Privilege escalation/shadow field pollution.
3. **Payload 3: Arbitrary post creation by an unauthenticated / unauthorized guest.**
   - *Attack:* Overwriting content archive.
4. **Payload 4: Incrementing likes on a post by more than 1 (or resetting it to 10,000).**
   - *Attack:* Metric manipulation.
5. **Payload 5: Creating comments connected to a non-existent post id.**
   - *Attack:* Orphaned orphan records.
6. **Payload 6: Comment creation exceeding character length limits (> 1000 characters).**
   - *Attack:* Storage resource exhaustion.
7. **Payload 7: Updating the parent `postId` of an existing comment.**
   - *Attack:* Moving responses to other scrolls to disrupt discussion.
8. **Payload 8: An unauthorized reader attempting to delete an elder scroll (post).**
   - *Attack:* Content destruction.
9. **Payload 9: Creating/updating a post with negative integers for `likes`, `bookmarks`, or `views`.**
   - *Attack:* State poisoning.
10. **Payload 10: Injecting empty author names or empty comments.**
    - *Attack:* Interface clutter with blank fields.
11. **Payload 11: Attempting to modify immutable fields like `createdAt` on a post.**
    - *Attack:* Evading temporal auditing.
12. **Payload 12: Future dated post or comment creation bypassing temporal limits.**
    - *Attack:* Chronological poisoning.

---

## Test Runner Definition
Since this is a client-side Vite React client with standard library structures, we will write a unit test suite if needed, but since our deployment executes `deploy_firebase` to compile the live rules and runs in the cloud sandbox, we will define our rules to securely enforce these validations of keys size and values limits.
