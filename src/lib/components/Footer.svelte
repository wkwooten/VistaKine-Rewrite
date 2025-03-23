<footer>
	<p>&copy; {new Date().getFullYear()} VistaKine. All rights reserved.</p>
	<ul>
			<li><a href="/privacy">Privacy Policy</a></li>
			<li><a href="/terms">Terms of Service</a></li>
	</ul>
</footer>

<style lang="scss">
	footer {
			margin-top: var(--space-xl); // Space between wrapper and footer
			padding: var(--space-m) var(--space-l);
			text-align: center;
			color: var(--text-light); // Lighter text color for footer
			font-size: var(--step--1); // Smaller font size for footer
			border-top: 1px solid var(--border-color); // Subtle top border

			ul {
					list-style: none;
					padding: 0;
					margin-top: var(--space-s);
					display: flex;
					justify-content: center;
					gap: var(--space-m);
			}

			a {
					color: var(--text-light); // Lighter link color in footer
					text-decoration: underline; // Underline for links in footer
			}
	}
</style>