
def admin_new_issue_email(issue):
    return f"""
    <h2>🚨 New Campus Issue Reported</h2>

    <p><b>Title:</b> {issue.get("title")}</p>
    <p><b>Category:</b> {issue.get("category")}</p>
    <p><b>Severity:</b> {issue.get("severity")}</p>
    <p><b>Location:</b> {issue.get("location")}</p>

    <p><b>Description:</b></p>
    <p>{issue.get("description")}</p>

    <hr/>
    <p>Please log in to the Admin Dashboard to take action.</p>
    """
def student_issue_finalized_email(issue, admin_message):
    status = issue.get("status")

    return f"""
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>Campus Issue Update</h2>

      <p>Your reported issue has been <b>{status.lower()}</b>.</p>

      <hr/>

      <p><b>Issue:</b> {issue.get("title")}</p>
      <p><b>Location:</b> {issue.get("location")}</p>

      <hr/>

      <p><b>Message from Administration:</b></p>
      <p>{admin_message}</p>

      <br/>
      <p style="color:#555;font-size:13px;">
        — Campus Issue Portal
      </p>
    </div>
    """
